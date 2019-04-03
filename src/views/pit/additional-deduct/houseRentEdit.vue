<template>
  <basic-edit
    ref="ref"
    :dialog-title="dialogTitle"
    :default-model="defaultModel"
    :get-entity="getEntity"
    :save-entity="saveEntity"
    :handle-model="handleModel"
    :handle-items="handleItems"
    :before-save="beforeSave"
    :after-save="afterSave" />
</template>

<script>
import moment from 'moment'
import { isNotEmpty, validateIDNumber, checkSocialCreditCodeOrg, checkTaxpayerId } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { houseRentSingle, houseRentSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'HouseRentEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '住房租金',
      defaultModel: {
        ADHR_WORK_SITE: ['001', '001001'],
        ADHR_LESSOR_TYPE: '1'
      },
      getEntity: houseRentSingle,
      saveEntity: houseRentSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { ADHR_ID: PK }
        this.dialogTitle = '修改住房租金'
      } else {
        this.dialogTitle = '创建住房租金'
      }
      this.$refs['ref'].showDialog(primaryKey)
    },
    beforeSave(operate, model) {
      this.$emit('before-save', model)
    },
    afterSave(operate, model) {
      this.$emit('after-save', model)
    },
    handleModel(operate, model) {
      if (model.ADHR_LESSOR_TYPE === '2') {
        model.ADHR_LESSOR_ID_TYPE = ''
      }
      return model
    },
    handleItems(operate, model) {
      const items = []
      items.push({
        props: { label: '主要工作地', prop: 'ADHR_WORK_SITE' },
        items: [
          {
            tag: 'el-cascader',
            name: 'ADHR_WORK_SITE',
            props: { options: this.$store.getters.getDistricts }
          }
        ]
      })
      items.push({
        props: {
          label: '住房坐落地址',
          prop: 'ADHR_ADDRESS',
          rules: [
            { required: true, message: '请输入住房坐落地址', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADHR_ADDRESS' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '出租方' })
      items.push({
        props: { label: '出租方类型', prop: 'ADHR_LESSOR_TYPE' },
        items: buildFormItemsByDicts('AD_H3E_R2T_ADHR_LESSOR_TYPE', 'el-radio', 'ADHR_LESSOR_TYPE', { linkage: true })
      })
      items.push({
        props: {
          label: '出租方名称',
          prop: 'ADHR_LESSOR_NAME',
          rules: [
            { required: true, message: '请输入出租方名称', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADHR_LESSOR_NAME' }
        ]
      })
      if (model.ADHR_LESSOR_TYPE === '1') {
        items.push({
          props: {
            label: '出租方身份证件类型',
            prop: 'ADHR_LESSOR_ID_TYPE',
            rules: [
              { required: true, message: '请选择出租方身份证件类型', trigger: 'blur' }
            ]
          },
          items: [
            {
              tag: 'el-select',
              name: 'ADHR_LESSOR_ID_TYPE',
              items: buildFormItemsByDicts('ID_TYPE', 'el-option')
            }
          ]
        })
        items.push({
          props: {
            label: '出租方身份证件号码',
            prop: 'ADHR_LESSOR_ID_NUMBER',
            rules: [
              { required: true, message: '请输入出租方身份证件号码', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  if (model.ADHR_LESSOR_ID_TYPE === '01') {
                    if (validateIDNumber(value)) {
                      callback()
                    } else {
                      callback(new Error('居民身份证号格式错误'))
                    }
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
          },
          items: [
            { tag: 'el-input', name: 'ADHR_LESSOR_ID_NUMBER' }
          ]
        })
      } else if (model.ADHR_LESSOR_TYPE === '2') {
        items.push({
          props: {
            label: '出租方纳税人识别号',
            prop: 'ADHR_LESSOR_ID_NUMBER',
            rules: [
              { required: true, message: '请输入出租方纳税人识别号', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  if (checkSocialCreditCodeOrg(value) || checkTaxpayerId(value)) {
                    callback()
                  } else {
                    callback(new Error('纳税人识别号格式错误'))
                  }
                },
                trigger: 'blur'
              }
            ]
          },
          items: [
            { tag: 'el-input', name: 'ADHR_LESSOR_ID_NUMBER' }
          ]
        })
      }
      items.push({ tag: 'el-new-row', title: '租赁合同' })
      items.push({
        props: { label: '租赁合同编号', prop: 'ADHR_LEASE_CN' },
        items: [
          { tag: 'el-input', name: 'ADHR_LEASE_CN' }
        ]
      })
      items.push({
        props: {
          label: '起始时间',
          prop: 'ADHR_LEASE_DATE_START',
          rules: [
            { required: true, message: '请选择起始时间', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'ADHR_LEASE_DATE_START' }
        ]
      })
      items.push({
        props: {
          label: '结束时间',
          prop: 'ADHR_LEASE_DATE_END',
          rules: [
            { required: true, message: '请选择结束时间', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const ADHR_LEASE_DATE_START = _model.ADHR_LEASE_DATE_START
                const ADHR_LEASE_DATE_END = _model.ADHR_LEASE_DATE_END
                if (isNotEmpty(ADHR_LEASE_DATE_START) && isNotEmpty(ADHR_LEASE_DATE_END)) {
                  const startDate = moment(ADHR_LEASE_DATE_START)
                  const endDate = moment(ADHR_LEASE_DATE_END)
                  if (startDate.isBefore(endDate)) {
                    callback()
                  } else {
                    callback(new Error('结束时间不能小于或等于起始时间'))
                  }
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'ADHR_LEASE_DATE_END' }
        ]
      })
      return items
    }
  }
}
</script>
