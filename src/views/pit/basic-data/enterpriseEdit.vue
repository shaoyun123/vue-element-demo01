<template>
  <basic-edit
    ref="ref"
    :form-title="formTitle"
    :default-model="defaultModel"
    :get-entity="getEntity"
    :save-entity="saveEntity"
    :handle-model="handleModel"
    :handle-items="handleItems"
    :before-save="beforeSave"
    :after-save="afterSave" />
</template>

<script>
import { isNotEmpty, checkSocialCreditCodeOrg, checkTaxpayerId } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { enterpriseSingle, enterpriseSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'EnterpriseEdit',
  components: { BasicEdit },
  data() {
    return {
      formTitle: '企业信息',
      defaultModel: {
        E_TYPE: '01'
      },
      getEntity: enterpriseSingle,
      saveEntity: enterpriseSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { E_ID: PK }
        this.formTitle = '修改企业信息'
      } else {
        this.formTitle = '创建企业信息'
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
      return model
    },
    handleItems(operate, model) {
      const items = []
      items.push({
        props: {
          label: '企业名',
          prop: 'E_NAME',
          rules: [
            { required: true, message: '请输入企业名', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'E_NAME' }
        ]
      })
      items.push({
        props: {
          label: '纳税人识别号',
          prop: 'E_TAX_ID_NUMBER',
          rules: [
            { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
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
          { tag: 'el-input', name: 'E_TAX_ID_NUMBER' }
        ]
      })
      items.push({
        props: { label: '企业性质', prop: 'E_TYPE' },
        items: buildFormItemsByDicts('E8E_E_TYPE', 'el-radio', 'E_TYPE')
      })
      items.push({
        props: { label: '地址', prop: 'E_ADDRESS' },
        items: [
          { tag: 'el-input', name: 'E_ADDRESS' }
        ]
      })
      items.push({
        props: { label: '电话', prop: 'E_PHONE' },
        items: [
          { tag: 'el-input', name: 'E_PHONE' }
        ]
      })
      items.push({
        props: { label: '备注', prop: 'E_REMARK' },
        items: [
          {
            tag: 'el-input',
            name: 'E_REMARK',
            props: { type: 'textarea' }
          }
        ]
      })
      return items
    }
  }
}
</script>
