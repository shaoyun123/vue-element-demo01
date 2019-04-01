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
import * as validator from '@/utils/validate'
import { payFiducialSingle, payFiducialSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'PayFiducialEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '缴纳基数',
      defaultModel: {
        PFC_PAY_SITE: ['001', '001001'],
        PFC_WAGE_AVERAGE: 0,
        PFC_PENSION_MAX: 0,
        PFC_PENSION_MIN: 0,
        PFC_MEDICAL_MAX: 0,
        PFC_MEDICAL_MIN: 0,
        PFC_UNEMPLOYMENT_MAX: 0,
        PFC_UNEMPLOYMENT_MIN: 0,
        PFC_PROCREATION_MAX: 0,
        PFC_PROCREATION_MIN: 0,
        PFC_INJURY_MAX: 0,
        PFC_INJURY_MIN: 0,
        PFC_CR_FUND_MAX: 0,
        PFC_CR_FUND_MIN: 0,
        PFC_CR_FUND_S_MAX: 0,
        PFC_CR_FUND_S_MIN: 0
      },
      getEntity: payFiducialSingle,
      saveEntity: payFiducialSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (
        validator.isNotEmpty(PK) &&
        validator.isNotEmpty(PK.PFC_PAY_SITE) &&
        validator.isNotEmpty(PK.PFC_YEAR)
      ) {
        primaryKey = PK
        this.dialogTitle = '修改缴纳基数'
      } else {
        this.dialogTitle = '创建缴纳基数'
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
        props: { label: '缴纳地', prop: 'PFC_PAY_SITE' },
        items: [
          {
            tag: 'el-cascader',
            name: 'PFC_PAY_SITE',
            props: { options: this.$store.getters.getDistricts }
          }
        ]
      })
      items.push({
        props: {
          label: '年度',
          prop: 'PFC_YEAR',
          rules: [
            { required: true, message: '请选择年度', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-date-picker',
            name: 'PFC_YEAR',
            props: { type: 'year' }
          }
        ]
      })
      items.push({ tag: 'el-new-group', title: '五险一金' })
      items.push({ tag: 'el-new-row', title: '养老' })
      items.push({
        props: {
          label: '养老缴纳基数上限',
          prop: 'PFC_PENSION_MAX',
          rules: [
            { required: true, message: '请输入养老缴纳基数上限', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_PENSION_MAX' }
        ]
      })
      items.push({
        props: {
          label: '养老缴纳基数下限',
          prop: 'PFC_PENSION_MIN',
          rules: [
            { required: true, message: '请输入养老缴纳基数下限', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_PENSION_MIN' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '医疗' })
      items.push({
        props: {
          label: '医疗缴纳基数上限',
          prop: 'PFC_MEDICAL_MAX',
          rules: [
            { required: true, message: '请输入医疗缴纳基数上限', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_MEDICAL_MAX' }
        ]
      })
      items.push({
        props: {
          label: '医疗缴纳基数下限',
          prop: 'PFC_MEDICAL_MIN',
          rules: [
            { required: true, message: '请输入医疗缴纳基数下限', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_MEDICAL_MIN' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '失业' })
      items.push({
        props: {
          label: '失业缴纳基数上限',
          prop: 'PFC_UNEMPLOYMENT_MAX',
          rules: [
            { required: true, message: '请输入失业缴纳基数上限', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_UNEMPLOYMENT_MAX' }
        ]
      })
      items.push({
        props: {
          label: '失业缴纳基数下限',
          prop: 'PFC_UNEMPLOYMENT_MIN',
          rules: [
            { required: true, message: '请输入失业缴纳基数下限', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_UNEMPLOYMENT_MIN' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '生育' })
      items.push({
        props: {
          label: '生育缴纳基数上限',
          prop: 'PFC_PROCREATION_MAX',
          rules: [
            { required: true, message: '请输入生育缴纳基数上限', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_PROCREATION_MAX' }
        ]
      })
      items.push({
        props: {
          label: '生育缴纳基数下限',
          prop: 'PFC_PROCREATION_MIN',
          rules: [
            { required: true, message: '请输入生育缴纳基数下限', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_PROCREATION_MIN' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '工伤' })
      items.push({
        props: {
          label: '工伤缴纳基数上限',
          prop: 'PFC_INJURY_MAX',
          rules: [
            { required: true, message: '请输入工伤缴纳基数上限', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_INJURY_MAX' }
        ]
      })
      items.push({
        props: {
          label: '工伤缴纳基数下限',
          prop: 'PFC_INJURY_MIN',
          rules: [
            { required: true, message: '请输入工伤缴纳基数下限', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_INJURY_MIN' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '公积金' })
      items.push({
        props: {
          label: '公积金缴纳基数上限',
          prop: 'PFC_CR_FUND_MAX',
          rules: [
            { required: true, message: '请输入公积金缴纳基数上限', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_CR_FUND_MAX' }
        ]
      })
      items.push({
        props: {
          label: '公积金补充缴纳基数下限',
          prop: 'PFC_CR_FUND_MIN',
          rules: [
            { required: true, message: '请输入公积金补充缴纳基数下限', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_CR_FUND_MIN' }
        ]
      })
      items.push({
        props: {
          label: '公积金补充缴纳基数上限',
          prop: 'PFC_CR_FUND_S_MAX',
          rules: [
            { required: true, message: '请输入公积金补充缴纳基数上限', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_CR_FUND_S_MAX' }
        ]
      })
      items.push({
        props: {
          label: '公积金补充缴纳基数下限',
          prop: 'PFC_CR_FUND_S_MIN',
          rules: [
            { required: true, message: '请输入公积金补充缴纳基数下限', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'PFC_CR_FUND_S_MIN' }
        ]
      })
      return items
    },
    validateDataRange(rule, value, callback) {
      const model = this.$refs['ref'].getModel()
      const minField = rule.field
      const maxField = `${minField.substring(0, minField.length - 3)}MAX`
      const min = model[minField]
      const max = model[maxField]
      if ((min === 0 && max === 0) || min < max) {
        callback()
      } else {
        callback(new Error('基数上限必须大于基数下限，或上限下限都为 0'))
      }
    }
  }
}
</script>
