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
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { adultEducateSingle, adultEducateSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'AdultEducateEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '继续教育',
      defaultModel: {
        ADAE_EDUCATE_STAGE: '01',
        ADAE_EDUCATE_TYPE: '1'
      },
      getEntity: adultEducateSingle,
      saveEntity: adultEducateSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { ADAE_ID: PK }
        this.dialogTitle = '修改继续教育'
      } else {
        this.dialogTitle = '创建继续教育'
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
      if (isEmpty(model.ADAE_CERTIFICATE_DATE)) {
        model.ADAE_CERTIFICATE_NAME = ''
        model.ADAE_CERTIFICATE_ID = ''
        model.ADAE_CERTIFICATE_ISSUER = ''
      }
      return model
    },
    handleItems(operate, model) {
      const items = []
      items.push({ tag: 'el-new-row', title: '教育' })
      items.push({
        props: {
          label: '起始时间',
          prop: 'ADAE_STAGE_START',
          rules: [
            { required: true, message: '请选择起始时间', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'ADAE_STAGE_START' }
        ]
      })
      items.push({
        props: {
          label: '结束时间',
          prop: 'ADAE_STAGE_END',
          rules: [
            { required: true, message: '请选择结束时间', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const ADAE_STAGE_START = _model.ADAE_STAGE_START
                const ADAE_STAGE_END = _model.ADAE_STAGE_END
                if (isNotEmpty(ADAE_STAGE_START) && isNotEmpty(ADAE_STAGE_END)) {
                  const startDate = moment(ADAE_STAGE_START)
                  const endDate = moment(ADAE_STAGE_END)
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
          { tag: 'el-date-picker', name: 'ADAE_STAGE_END' }
        ]
      })
      items.push({
        props: { label: '继续教育阶段', prop: 'ADAE_SCHOOL_SITE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADAE_EDUCATE_STAGE',
            items: buildFormItemsByDicts('EDUCATION', 'el-option')
          }
        ]
      })
      items.push({
        props: { label: '继续教育类型', prop: 'ADAE_EDUCATE_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADAE_EDUCATE_TYPE',
            items: buildFormItemsByDicts('AD_A3T_E5E_ADAE_EDUCATE_TYPE', 'el-option')
          }
        ]
      })
      items.push({ tag: 'el-new-row', title: '发证' })
      items.push({
        props: { label: '发证（批准）日期', prop: 'ADAE_CERTIFICATE_DATE' },
        items: [
          { tag: 'el-date-picker', name: 'ADAE_CERTIFICATE_DATE', linkage: true }
        ]
      })
      if (isNotEmpty(model.ADAE_CERTIFICATE_DATE)) {
        items.push({
          props: {
            label: '证书名称',
            prop: 'ADAE_CERTIFICATE_NAME',
            rules: [
              { required: true, message: '请输入证书名称', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input', name: 'ADAE_CERTIFICATE_NAME' }
          ]
        })
        items.push({
          props: {
            label: '证书编号',
            prop: 'ADAE_CERTIFICATE_ID',
            rules: [
              { required: true, message: '请输入证书编号', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input', name: 'ADAE_CERTIFICATE_ID' }
          ]
        })
        items.push({
          props: {
            label: '发证机关',
            prop: 'ADAE_CERTIFICATE_ISSUER',
            rules: [
              { required: true, message: '请输入发证机关', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input', name: 'ADAE_CERTIFICATE_ISSUER' }
          ]
        })
      }
      return items
    }
  }
}
</script>
