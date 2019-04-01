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
import * as validator from '@/utils/validate'
import { payRatioSingle, payRatioSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'PayRatioEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '缴纳比例',
      defaultModel: {
        PRC_PAY_SITE: ['001', '001001']
      },
      getEntity: payRatioSingle,
      saveEntity: payRatioSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (
        validator.isNotEmpty(PK) &&
        validator.isNotEmpty(PK.PRC_PAY_SITE) &&
        validator.isNotEmpty(PK.PRC_EFFECTIVE_DATE) &&
        validator.isNotEmpty(PK.PRC_EXPIRY_DATE)
      ) {
        primaryKey = PK
        this.dialogTitle = '修改缴纳比例'
      } else {
        this.dialogTitle = '创建缴纳比例'
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
        props: { label: '缴纳地', prop: 'PRC_PAY_SITE' },
        items: [
          {
            tag: 'el-cascader',
            name: 'PRC_PAY_SITE',
            props: { options: this.$store.getters.getDistricts }
          }
        ]
      })
      items.push({
        props: {
          label: '有效期',
          prop: 'PRC_EFFECTIVE_DATE',
          rules: [
            { required: true, message: '请选择有效期', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'PRC_EFFECTIVE_DATE' }
        ]
      })
      items.push({
        props: {
          label: '失效期',
          prop: 'PRC_EXPIRY_DATE',
          rules: [
            { required: true, message: '请选择失效期', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const PRC_EFFECTIVE_DATE = _model.PRC_EFFECTIVE_DATE
                const PRC_EXPIRY_DATE = _model.PRC_EXPIRY_DATE
                if (validator.isNotEmpty(PRC_EFFECTIVE_DATE) && validator.isNotEmpty(PRC_EXPIRY_DATE)) {
                  const effectiveDate = moment(PRC_EFFECTIVE_DATE)
                  const expiryDate = moment(PRC_EXPIRY_DATE)
                  if (effectiveDate.isBefore(expiryDate)) {
                    callback()
                  } else {
                    callback(new Error('失效期不能小于或等于有效期'))
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
          { tag: 'el-date-picker', name: 'PRC_EXPIRY_DATE' }
        ]
      })
      items.push({ tag: 'el-new-group', title: '五险一金' })
      items.push({ tag: 'el-new-row', title: '养老' })
      items.push({
        props: {
          label: '养老个人缴纳比例',
          prop: 'PRC_PENSION_P',
          rules: [
            { required: true, message: '请输入养老个人缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PENSION_P' }
        ]
      })
      items.push({
        props: {
          label: '养老企业缴纳比例',
          prop: 'PRC_PENSION_E',
          rules: [
            { required: true, message: '请输入养老企业缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PENSION_E' }
        ]
      })
      items.push({
        props: {
          label: '养老企业缴纳比例',
          prop: 'PRC_PENSION_PS',
          rules: [
            { required: true, message: '请输入养老企业缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PENSION_PS' }
        ]
      })
      items.push({
        props: {
          label: '养老企业补充缴纳比例',
          prop: 'PRC_PENSION_ES',
          rules: [
            { required: true, message: '请输入养老企业补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PENSION_ES' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '医疗' })
      items.push({
        props: {
          label: '医疗个人缴纳比例',
          prop: 'PRC_MEDICAL_P',
          rules: [
            { required: true, message: '请输入医疗个人缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_MEDICAL_P' }
        ]
      })
      items.push({
        props: {
          label: '医疗企业缴纳比例',
          prop: 'PRC_MEDICAL_E',
          rules: [
            { required: true, message: '请输入医疗企业缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_MEDICAL_E' }
        ]
      })
      items.push({
        props: {
          label: '医疗个人补充缴纳比例',
          prop: 'PRC_MEDICAL_PS',
          rules: [
            { required: true, message: '请输入医疗个人补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_MEDICAL_PS' }
        ]
      })
      items.push({
        props: {
          label: '医疗企业补充缴纳比例',
          prop: 'PRC_MEDICAL_ES',
          rules: [
            { required: true, message: '请输入医疗企业补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_MEDICAL_ES' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '失业' })
      items.push({
        props: {
          label: '失业个人缴纳比例',
          prop: 'PRC_UNEMPLOYMENT_P',
          rules: [
            { required: true, message: '请输入失业个人缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_UNEMPLOYMENT_P' }
        ]
      })
      items.push({
        props: {
          label: '失业企业缴纳比例',
          prop: 'PRC_UNEMPLOYMENT_E',
          rules: [
            { required: true, message: '请输入失业企业缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_UNEMPLOYMENT_E' }
        ]
      })
      items.push({
        props: {
          label: '失业个人补充缴纳比例',
          prop: 'PRC_UNEMPLOYMENT_PS',
          rules: [
            { required: true, message: '请输入失业个人补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_UNEMPLOYMENT_PS' }
        ]
      })
      items.push({
        props: {
          label: '失业企业补充缴纳比例',
          prop: 'PRC_UNEMPLOYMENT_ES',
          rules: [
            { required: true, message: '请输入失业企业补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_UNEMPLOYMENT_ES' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '生育' })
      items.push({
        props: {
          label: '生育个人缴纳比例',
          prop: 'PRC_PROCREATION_P',
          rules: [
            { required: true, message: '请输入生育个人缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PROCREATION_P' }
        ]
      })
      items.push({
        props: {
          label: '生育企业缴纳比例',
          prop: 'PRC_PROCREATION_E',
          rules: [
            { required: true, message: '请输入生育企业缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PROCREATION_E' }
        ]
      })
      items.push({
        props: {
          label: '生育个人补充缴纳比例',
          prop: 'PRC_PROCREATION_PS',
          rules: [
            { required: true, message: '请输入生育个人补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PROCREATION_PS' }
        ]
      })
      items.push({
        props: {
          label: '生育企业补充缴纳比例',
          prop: 'PRC_PROCREATION_ES',
          rules: [
            { required: true, message: '请输入生育企业补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_PROCREATION_ES' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '工伤' })
      items.push({
        props: {
          label: '工伤个人缴纳比例',
          prop: 'PRC_INJURY_P',
          rules: [
            { required: true, message: '请输入工伤个人缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_INJURY_P' }
        ]
      })
      items.push({
        props: {
          label: '工伤企业缴纳比例',
          prop: 'PRC_INJURY_E',
          rules: [
            { required: true, message: '请输入工伤企业缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_INJURY_E' }
        ]
      })
      items.push({
        props: {
          label: '工伤个人补充缴纳比例',
          prop: 'PRC_INJURY_PS',
          rules: [
            { required: true, message: '请输入工伤个人补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_INJURY_PS' }
        ]
      })
      items.push({
        props: {
          label: '工伤企业补充缴纳比例',
          prop: 'PRC_INJURY_ES',
          rules: [
            { required: true, message: '请输入工伤企业补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_INJURY_ES' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '公积金' })
      items.push({
        props: {
          label: '公积金个人缴纳比例',
          prop: 'PRC_CR_FUND_P',
          rules: [
            { required: true, message: '请输入公积金个人缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_CR_FUND_P' }
        ]
      })
      items.push({
        props: {
          label: '公积金企业缴纳比例',
          prop: 'PRC_CR_FUND_E',
          rules: [
            { required: true, message: '请输入公积金企业缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_CR_FUND_E' }
        ]
      })
      items.push({
        props: {
          label: '公积金个人补充缴纳比例',
          prop: 'PRC_CR_FUND_PS',
          rules: [
            { required: true, message: '请输入公积金个人补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_CR_FUND_PS' }
        ]
      })
      items.push({
        props: {
          label: '公积金企业补充缴纳比例',
          prop: 'PRC_CR_FUND_ES',
          rules: [
            { required: true, message: '请输入公积金企业补充缴纳比例', trigger: 'blur' },
            { validator: this.validateDataRange, trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'PRC_CR_FUND_ES' }
        ]
      })
      return items
    },
    validateDataRange(rule, value, callback) {
      const re = /^([0-9]+([.]{1}[0-9]+){0,1})(, [0-9]+([.]{1}[0-9]+){0,1})*$/
      if (!re.test(value)) {
        callback(new Error('请输入数字，多个数字间以 [, ] 号分隔，例：5, 7, 9'))
      } else {
        callback()
      }
    }
  }
}
</script>
