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
import { parallel } from '@/utils/request'
import { trim } from '@/utils'
import * as validator from '@/utils/validate'
import { buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'
import { salarySingle, salarySave, enterpriseList, payFiducialList, payRatioList } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'SalaryEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '',
      defaultModel: {
        S_PAY_SITE: ['002', '002001'],
        S_PAY_TYPE: '02',
        S_WAGE_BASIC: 0,
        S_WAGE_POST: 0,
        S_WAGE_KPI: 0,
        S_WAGE_OVERTIME: 0,
        S_WAGE_RETROACTIVE: 0,
        S_WAGE_PROBATION: 0,
        S_SUBSIDY: 0,
        S_BONUS: 0,
        S_DEDUCT: 0,
        S_FIDUCIAL_PENSION: 0,
        S_RATIO_PENSION_P: 0,
        S_RATIO_PENSION_E: 0,
        S_RATIO_PENSION_PS: 0,
        S_RATIO_PENSION_ES: 0,
        S_FIDUCIAL_MEDICAL: 0,
        S_RATIO_MEDICAL_P: 0,
        S_RATIO_MEDICAL_E: 0,
        S_RATIO_MEDICAL_PS: 0,
        S_RATIO_MEDICAL_ES: 0,
        S_FIDUCIAL_UNEMPLOYMENT: 0,
        S_RATIO_UNEMPLOYMENT_P: 0,
        S_RATIO_UNEMPLOYMENT_E: 0,
        S_RATIO_UNEMPLOYMENT_PS: 0,
        S_RATIO_UNEMPLOYMENT_ES: 0,
        S_FIDUCIAL_PROCREATION: 0,
        S_RATIO_PROCREATION_P: 0,
        S_RATIO_PROCREATION_E: 0,
        S_RATIO_PROCREATION_PS: 0,
        S_RATIO_PROCREATION_ES: 0,
        S_FIDUCIAL_INJURY: 0,
        S_RATIO_INJURY_P: 0,
        S_RATIO_INJURY_E: 0,
        S_RATIO_INJURY_PS: 0,
        S_RATIO_INJURY_ES: 0,
        S_FIDUCIAL_CR_FUND: 0,
        S_RATIO_CR_FUND_P: 0,
        S_RATIO_CR_FUND_E: 0,
        S_FIDUCIAL_CR_FUND_S: 0,
        S_RATIO_CR_FUND_PS: 0,
        S_RATIO_CR_FUND_ES: 0
      },
      getEntity: this.getSalary,
      saveEntity: salarySave,
      enterpriseOptions: [],
      payFiducialRanges: {},
      payRatioOptions: {}
    }
  },
  methods: {
    buildWageItem(name, label) {
      return {
        props: {
          label,
          prop: name,
          rules: [
            { required: true, message: `请输入${label}`, trigger: 'blur' }
          ]
        },
        items: [{ tag: 'el-input-number', name }]
      }
    },
    initPayFiducialRanges(payFiducialList, model) {
      let payFiducial = null
      if (validator.isNotEmpty(payFiducialList)) {
        payFiducial = payFiducialList[0]
      }
      this.buildPayFiducialRanges(payFiducial, 'PENSION', model)
      this.buildPayFiducialRanges(payFiducial, 'MEDICAL', model)
      this.buildPayFiducialRanges(payFiducial, 'UNEMPLOYMENT', model)
      this.buildPayFiducialRanges(payFiducial, 'PROCREATION', model)
      this.buildPayFiducialRanges(payFiducial, 'INJURY', model)
      this.buildPayFiducialRanges(payFiducial, 'CR_FUND', model)
      this.buildPayFiducialRanges(payFiducial, 'CR_FUND_S', model)
    },
    buildPayFiducialRanges(payFiducial, type, model) {
      if (validator.isNotEmpty(payFiducial)) {
        const max = payFiducial[`PFC_${type}_MAX`]
        const min = payFiducial[`PFC_${type}_MIN`]
        this.payFiducialRanges[`S_FIDUCIAL_${type}`] = [min, max]
        if (validator.isNotEmpty(model)) {
          model[`S_FIDUCIAL_${type}`] = min
        }
      } else if (validator.isNotEmpty(model)) {
        model[`S_FIDUCIAL_${type}`] = 0
      }
    },
    buildPayFiducialItem(name, label) {
      let tip = ''
      const props = {}
      const ranges = this.payFiducialRanges[name]
      if (validator.isNotEmpty(ranges)) {
        const min = ranges[0]
        const max = ranges[1]
        tip = `取值范围 [${min} - ${max}]`
        props.min = min
        props.max = max
      }
      return {
        tip,
        props: {
          label,
          prop: name,
          rules: [
            { required: true, message: `请输入${label}`, trigger: 'blur' }
          ]
        },
        items: [{ tag: 'el-input-number', name, props }]
      }
    },
    initPayRatioOptions(payRatioList, model) {
      let payRatio = null
      if (validator.isNotEmpty(payRatioList)) {
        payRatio = payRatioList[0]
      }
      this.buildPayRatioOptions(payRatio, 'PENSION_P', model)
      this.buildPayRatioOptions(payRatio, 'PENSION_E', model)
      this.buildPayRatioOptions(payRatio, 'PENSION_PS', model)
      this.buildPayRatioOptions(payRatio, 'PENSION_ES', model)
      this.buildPayRatioOptions(payRatio, 'MEDICAL_P', model)
      this.buildPayRatioOptions(payRatio, 'MEDICAL_E', model)
      this.buildPayRatioOptions(payRatio, 'MEDICAL_PS', model)
      this.buildPayRatioOptions(payRatio, 'MEDICAL_ES', model)
      this.buildPayRatioOptions(payRatio, 'UNEMPLOYMENT_P', model)
      this.buildPayRatioOptions(payRatio, 'UNEMPLOYMENT_E', model)
      this.buildPayRatioOptions(payRatio, 'UNEMPLOYMENT_PS', model)
      this.buildPayRatioOptions(payRatio, 'UNEMPLOYMENT_ES', model)
      this.buildPayRatioOptions(payRatio, 'PROCREATION_P', model)
      this.buildPayRatioOptions(payRatio, 'PROCREATION_E', model)
      this.buildPayRatioOptions(payRatio, 'PROCREATION_PS', model)
      this.buildPayRatioOptions(payRatio, 'PROCREATION_ES', model)
      this.buildPayRatioOptions(payRatio, 'INJURY_P', model)
      this.buildPayRatioOptions(payRatio, 'INJURY_E', model)
      this.buildPayRatioOptions(payRatio, 'INJURY_PS', model)
      this.buildPayRatioOptions(payRatio, 'INJURY_ES', model)
      this.buildPayRatioOptions(payRatio, 'CR_FUND_P', model)
      this.buildPayRatioOptions(payRatio, 'CR_FUND_E', model)
      this.buildPayRatioOptions(payRatio, 'CR_FUND_PS', model)
      this.buildPayRatioOptions(payRatio, 'CR_FUND_ES', model)
    },
    buildPayRatioOptions(payRatio, type, model) {
      if (validator.isNotEmpty(payRatio)) {
        const range = payRatio[`PRC_${type}`]
        if (validator.isNotEmpty(range)) {
          const options = []
          const values = range.split(',')
          values.forEach(value => {
            value = trim(value)
            const title = `${value} %`
            options.push({ value, title })
          })
          this.payRatioOptions[`S_RATIO_${type}`] = options
          if (validator.isNotEmpty(model)) {
            model[`S_RATIO_${type}`] = options[0].value
          }
        }
      } else if (validator.isNotEmpty(model)) {
        model[`S_RATIO_${type}`] = 0
      }
    },
    buildPayRatioItem(name, label) {
      const options = this.payRatioOptions[name]
      if (validator.isNotEmpty(options)) {
        return {
          props: {
            label,
            prop: name,
            rules: [
              { required: true, message: `请选择${label}`, trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-select', name, items: buildFormItems(options, 'value', 'title', 'el-option') }
          ]
        }
      } else {
        return {
          props: {
            label,
            prop: name,
            rules: [
              { required: true, message: `请输入${label}`, trigger: 'blur' },
              { validator: function(rule, value, callback) {
                const re = /^(0|[1-9]{1}[0-9]*)([.]{1}[0-9]+){0,1}$/
                if (!re.test(value)) {
                  callback(new Error('请输入数字'))
                } else if (value < 0 || value > 100) {
                  callback(new Error('有效的取值范围为 [0 - 100]'))
                } else {
                  callback()
                }
              }, trigger: 'blur' }
            ]
          },
          items: [
            {
              tag: 'el-input',
              name,
              items: [
                {
                  tag: 'i', props: { slot: 'append', class: 'el-icon-antd-percentage' }
                }
              ]
            }
          ]
        }
      }
    },
    getSalary(primaryKey) {
      const self = this
      self.payFiducialRanges = {}
      self.payRatioOptions = {}
      return salarySingle(primaryKey).then((response) => {
        const model = response.data
        let S_PAY_SITE = self.defaultModel.S_PAY_SITE
        if (validator.isNotEmpty(model)) {
          S_PAY_SITE = model.S_PAY_SITE
        }
        return parallel([
          payFiducialList({ PFC_PAY_SITE: S_PAY_SITE }),
          payRatioList({ PRC_PAY_SITE: S_PAY_SITE })
        ]).then((responses) => {
          const payFiducialList = responses[0].data.items
          const payRatioList = responses[1].data.items
          self.initPayFiducialRanges(payFiducialList)
          self.initPayRatioOptions(payRatioList)
          return response
        })
      })
    },
    showDialog(PK) {
      let primaryKey = null
      if (
        validator.isNotEmpty(PK) &&
        validator.isNotEmpty(PK.S_STAFF_NUMBER) &&
        validator.isNotEmpty(PK.S_TYPE)
      ) {
        primaryKey = PK
        this.dialogTitle = this.$store.getters.getDictTitle('S4Y_S_TYPE', PK.S_TYPE)
      }
      enterpriseList({}).then((response) => {
        this.enterpriseOptions = response.data.items
        this.$refs['ref'].showDialog(primaryKey)
      })
    },
    beforeSave(operate, model) {
      this.$emit('before-save', model)
    },
    afterSave(operate, model) {
      this.$emit('after-save', model)
    },
    handleModel(operate, model) {
      const self = this
      const ref = self.$refs['ref']
      ref.loading = true
      self.payFiducialRanges = {}
      self.payRatioOptions = {}
      const S_PAY_SITE = model.S_PAY_SITE
      return parallel([
        payFiducialList({ PFC_PAY_SITE: S_PAY_SITE }),
        payRatioList({ PRC_PAY_SITE: S_PAY_SITE })
      ]).then((responses) => {
        const payFiducialList = responses[0].data.items
        const payRatioList = responses[1].data.items
        self.initPayFiducialRanges(payFiducialList, model)
        self.initPayRatioOptions(payRatioList, model)
      }).then(() => {
        ref.loading = false
        return model
      })
    },
    handleItems(operate, model) {
      const items = []
      items.push({
        props: { label: '发放地', prop: 'S_PAY_SITE' },
        items: [
          {
            tag: 'el-cascader',
            name: 'S_PAY_SITE',
            linkage: true,
            props: { options: this.$store.getters.getDistricts }
          }
        ]
      })
      items.push({
        props: { label: '发放模式', prop: 'S_PAY_TYPE' },
        items: buildFormItemsByDicts('S4Y_S_PAY_TYPE', 'el-radio', 'S_PAY_TYPE')
      })
      items.push({
        props: {
          label: '发放主体',
          prop: 'S_PAY_ENTERPRISE_ID',
          rules: [
            { required: true, message: '请输入发放主体', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-select',
            name: 'S_PAY_ENTERPRISE_ID',
            items: buildFormItems(this.enterpriseOptions, 'E_ID', 'E_NAME', 'el-option')
          }
        ]
      })
      items.push({ tag: 'el-new-group', title: '薪资组成' })
      items.push(this.buildWageItem('S_WAGE_BASIC', '基本工资'))
      items.push(this.buildWageItem('S_WAGE_POST', '岗位工资'))
      items.push(this.buildWageItem('S_WAGE_KPI', '绩效工资'))
      items.push(this.buildWageItem('S_WAGE_OVERTIME', '加班工资'))
      items.push(this.buildWageItem('S_WAGE_RETROACTIVE', '补发工资'))
      items.push(this.buildWageItem('S_WAGE_PROBATION', '试用期工资'))
      items.push(this.buildWageItem('S_SUBSIDY', '补贴'))
      items.push(this.buildWageItem('S_BONUS', '奖金'))
      items.push(this.buildWageItem('S_DEDUCT', '扣款'))
      items.push({ tag: 'el-new-group', title: '五险一金' })
      items.push({ tag: 'el-new-row', title: '养老' })
      items.push(this.buildPayFiducialItem('S_FIDUCIAL_PENSION', '养老缴纳基数'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayRatioItem('S_RATIO_PENSION_P', '养老个人缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_PENSION_E', '养老企业缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_PENSION_PS', '养老个人补充缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_PENSION_ES', '养老企业补充缴纳比例'))
      items.push({ tag: 'el-new-row', title: '医疗' })
      items.push(this.buildPayFiducialItem('S_FIDUCIAL_MEDICAL', '医疗缴纳基数'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayRatioItem('S_RATIO_MEDICAL_P', '医疗个人缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_MEDICAL_E', '医疗企业缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_MEDICAL_PS', '医疗个人补充缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_MEDICAL_ES', '医疗企业补充缴纳比例'))
      items.push({ tag: 'el-new-row', title: '失业' })
      items.push(this.buildPayFiducialItem('S_FIDUCIAL_UNEMPLOYMENT', '失业缴纳基数'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayRatioItem('S_RATIO_UNEMPLOYMENT_P', '失业个人缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_UNEMPLOYMENT_E', '失业企业缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_UNEMPLOYMENT_PS', '失业个人补充缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_UNEMPLOYMENT_ES', '失业企业补充缴纳比例'))
      items.push({ tag: 'el-new-row', title: '生育' })
      items.push(this.buildPayFiducialItem('S_FIDUCIAL_PROCREATION', '生育缴纳基数'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayRatioItem('S_RATIO_PROCREATION_P', '生育个人缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_PROCREATION_E', '生育企业缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_PROCREATION_PS', '生育个人补充缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_PROCREATION_ES', '生育企业补充缴纳比例'))
      items.push({ tag: 'el-new-row', title: '工伤' })
      items.push(this.buildPayFiducialItem('S_FIDUCIAL_INJURY', '工伤缴纳基数'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayRatioItem('S_RATIO_INJURY_P', '工伤个人缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_INJURY_E', '工伤企业缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_INJURY_PS', '工伤个人补充缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_INJURY_ES', '工伤企业补充缴纳比例'))
      items.push({ tag: 'el-new-row', title: '公积金' })
      items.push(this.buildPayFiducialItem('S_FIDUCIAL_CR_FUND', '公积金缴纳基数'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayRatioItem('S_RATIO_CR_FUND_P', '公积金个人缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_CR_FUND_E', '公积金企业缴纳比例'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayFiducialItem('S_FIDUCIAL_CR_FUND_S', '公积金补充缴纳基数'))
      items.push({ tag: 'el-new-row' })
      items.push(this.buildPayRatioItem('S_RATIO_CR_FUND_PS', '公积金个人补充缴纳比例'))
      items.push(this.buildPayRatioItem('S_RATIO_CR_FUND_ES', '公积金企业补充缴纳比例'))
      return items
    }
  }
}
</script>
