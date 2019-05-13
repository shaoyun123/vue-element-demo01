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
import { isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { houseLoanSingle, houseLoanSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'HouseLoanEdit',
  components: { BasicEdit },
  data() {
    return {
      formTitle: '住房贷款利息',
      defaultModel: {
        ADHL_IS_BORROWER: 'Y',
        ADHL_CERTIFICATE_TYPE: '1',
        ADHL_LOAN_TYPE: '1',
        ADHL_RATIO: 100
      },
      getEntity: houseLoanSingle,
      saveEntity: houseLoanSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { ADHL_ID: PK }
        this.formTitle = '修改住房贷款利息'
      } else {
        this.formTitle = '创建住房贷款利息'
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
        props: { label: '本人是否借款人', prop: 'ADHL_IS_BORROWER' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'ADHL_IS_BORROWER')
      })
      items.push({ tag: 'el-new-row', title: '房屋' })
      items.push({
        props: { label: '房屋证书类型', prop: 'ADHL_CERTIFICATE_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADHL_CERTIFICATE_TYPE',
            items: buildFormItemsByDicts('AD_H3E_L2N_ADHL_CERTIFICATE_TYPE', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '房屋证书编号',
          prop: 'ADHL_CERTIFICATE_ID',
          rules: [
            { required: true, message: '请输入房屋证书编号', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADHL_CERTIFICATE_ID' }
        ]
      })
      items.push({
        props: {
          label: '房屋坐落地址',
          prop: 'ADHL_ADDRESS',
          rules: [
            { required: true, message: '请输入房屋坐落地址', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADHL_ADDRESS' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '贷款' })
      items.push({
        props: { label: '贷款类型', prop: 'ADHL_LOAN_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADHL_LOAN_TYPE',
            items: buildFormItemsByDicts('AD_H3E_L2N_ADHL_LOAN_TYPE', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '贷款银行',
          prop: 'ADHL_LOAN_BANK',
          rules: [
            { required: true, message: '请输入贷款银行', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADHL_LOAN_BANK' }
        ]
      })
      items.push({
        props: {
          label: '贷款合同编号',
          prop: 'ADHL_LOAN_CN',
          rules: [
            { required: true, message: '请输入贷款合同编号', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADHL_LOAN_CN' }
        ]
      })
      items.push({
        props: {
          label: '贷款期限（月）',
          prop: 'ADHL_LOAN_DEADLINE',
          rules: [
            { required: true, message: '请输入贷款期限（月）', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input-number',
            name: 'ADHL_LOAN_DEADLINE',
            props: { min: 1, precision: 0 }
          }
        ]
      })
      items.push({
        props: {
          label: '首次还款日期',
          prop: 'ADHL_FIRST_REPAY_DATE',
          rules: [
            { required: true, message: '请选择首次还款日期', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'ADHL_FIRST_REPAY_DATE' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '扣除' })
      items.push({
        props: { label: '扣除比例', prop: 'ADHL_RATIO' },
        items: [
          {
            tag: 'el-switch',
            name: 'ADHL_RATIO',
            props: { 'active-text': '50%', 'active-value': 50, 'inactive-text': '100%', 'inactive-value': 100 }
          }
        ]
      })
      return items
    }
  }
}
</script>
