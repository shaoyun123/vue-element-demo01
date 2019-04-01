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
import math from 'mathjs'
import moment from 'moment'
import * as validator from '@/utils/validate'
import { salarySnapshootSingle, salarySnapshootSave, staffList, salarySingle } from '@/api/pit'
import { getSalarySnapshootFormItems } from './kit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'SalarySnapshootEdit',
  components: { BasicEdit },
  props: {
    enterpriseOptions: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      dialogTitle: '薪金采集',
      defaultModel: {
        SS_SALARY_LOADED: false,
        SS_FREQ: 'M',
        SS_ISSUE: moment().subtract(1, 'months').format('YYYY-MM'),
        SS_TYPE: '01'
      },
      getEntity: salarySnapshootSingle,
      saveEntity: salarySnapshootSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (
        validator.isNotEmpty(PK) &&
        validator.isNotEmpty(PK.SS_FREQ) &&
        validator.isNotEmpty(PK.SS_ISSUE) &&
        validator.isNotEmpty(PK.SS_STAFF_NUMBER) &&
        validator.isNotEmpty(PK.SS_TYPE)
      ) {
        primaryKey = PK
      }
      this.$refs['ref'].showDialog(primaryKey)
    },
    beforeSave(operate, model) {
      const SS_SALARY_LOADED = model.SS_SALARY_LOADED
      if (operate === 'add' && !SS_SALARY_LOADED) {
        this.$message({
          showClose: true,
          message: '尚未加载指定员工薪资信息',
          type: 'warning'
        })
        return false
      } else {
        this.$emit('before-save', model)
      }
    },
    afterSave(operate, model) {
      this.$emit('after-save', model)
    },
    handleModel(operate, model) {
      return model
    },
    handleItems(operate, model) {
      const self = this
      return getSalarySnapshootFormItems(operate, model, {
        enterpriseOptions: self.enterpriseOptions,
        loadStaffs: self.loadStaffs,
        loadSalary: self.loadSalary
      })
    },
    loadStaffs(operate, model, queryString, callback) {
      if (validator.isNotEmpty(queryString)) {
        staffList({ S_NAME: queryString }).then(response => {
          const results = response.data.items
          callback(results)
        })
      }
    },
    loadSalary(operate, model) {
      const self = this
      const ref = self.$refs['ref']
      ref.loading = true
      const SS_STAFF_NUMBER = model.SS_STAFF_NUMBER
      const SS_TYPE = model.SS_TYPE
      salarySingle({ S_STAFF_NUMBER: SS_STAFF_NUMBER, S_TYPE: SS_TYPE }).then(response => {
        const salary = response.data
        if (validator.isNotEmpty(salary)) {
          const snapshoot = {}
          Object.keys(salary).forEach(key => {
            snapshoot[`S${key}`] = salary[key]
          })
          Object.assign(snapshoot, model)
          snapshoot.SS_SALARY_LOADED = true
          snapshoot.SS_WAGE_TOTAL = math.round(math.add(
            snapshoot.SS_WAGE_BASIC,
            snapshoot.SS_WAGE_POST,
            snapshoot.SS_WAGE_KPI,
            snapshoot.SS_WAGE_OVERTIME,
            snapshoot.SS_WAGE_RETROACTIVE,
            snapshoot.SS_WAGE_PROBATION,
            snapshoot.SS_SUBSIDY,
            snapshoot.SS_BONUS,
            snapshoot.SS_DEDUCT
          ), 2)
          snapshoot.SS_PAY_PENSION_P = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PENSION, snapshoot.SS_RATIO_PENSION_P, 0.01), 2)
          snapshoot.SS_PAY_PENSION_E = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PENSION, snapshoot.SS_RATIO_PENSION_E, 0.01), 2)
          snapshoot.SS_PAY_PENSION_PS = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PENSION, snapshoot.SS_RATIO_PENSION_PS, 0.01), 2)
          snapshoot.SS_PAY_PENSION_ES = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PENSION, snapshoot.SS_RATIO_PENSION_ES, 0.01), 2)
          snapshoot.SS_PAY_MEDICAL_P = math.round(math.multiply(snapshoot.SS_FIDUCIAL_MEDICAL, snapshoot.SS_RATIO_MEDICAL_P, 0.01), 2)
          snapshoot.SS_PAY_MEDICAL_E = math.round(math.multiply(snapshoot.SS_FIDUCIAL_MEDICAL, snapshoot.SS_RATIO_MEDICAL_E, 0.01), 2)
          snapshoot.SS_PAY_MEDICAL_PS = math.round(math.multiply(snapshoot.SS_FIDUCIAL_MEDICAL, snapshoot.SS_RATIO_MEDICAL_PS, 0.01), 2)
          snapshoot.SS_PAY_MEDICAL_ES = math.round(math.multiply(snapshoot.SS_FIDUCIAL_MEDICAL, snapshoot.SS_RATIO_MEDICAL_ES, 0.01), 2)
          snapshoot.SS_PAY_UNEMPLOYMENT_P = math.round(math.multiply(snapshoot.SS_FIDUCIAL_UNEMPLOYMENT, snapshoot.SS_RATIO_UNEMPLOYMENT_P, 0.01), 2)
          snapshoot.SS_PAY_UNEMPLOYMENT_E = math.round(math.multiply(snapshoot.SS_FIDUCIAL_UNEMPLOYMENT, snapshoot.SS_RATIO_UNEMPLOYMENT_E, 0.01), 2)
          snapshoot.SS_PAY_UNEMPLOYMENT_PS = math.round(math.multiply(snapshoot.SS_FIDUCIAL_UNEMPLOYMENT, snapshoot.SS_RATIO_UNEMPLOYMENT_PS, 0.01), 2)
          snapshoot.SS_PAY_UNEMPLOYMENT_ES = math.round(math.multiply(snapshoot.SS_FIDUCIAL_UNEMPLOYMENT, snapshoot.SS_RATIO_UNEMPLOYMENT_ES, 0.01), 2)
          snapshoot.SS_PAY_PROCREATION_P = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PROCREATION, snapshoot.SS_RATIO_PROCREATION_P, 0.01), 2)
          snapshoot.SS_PAY_PROCREATION_E = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PROCREATION, snapshoot.SS_RATIO_PROCREATION_E, 0.01), 2)
          snapshoot.SS_PAY_PROCREATION_PS = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PROCREATION, snapshoot.SS_RATIO_PROCREATION_PS, 0.01), 2)
          snapshoot.SS_PAY_PROCREATION_ES = math.round(math.multiply(snapshoot.SS_FIDUCIAL_PROCREATION, snapshoot.SS_RATIO_PROCREATION_ES, 0.01), 2)
          snapshoot.SS_PAY_INJURY_P = math.round(math.multiply(snapshoot.SS_FIDUCIAL_INJURY, snapshoot.SS_RATIO_INJURY_P, 0.01), 2)
          snapshoot.SS_PAY_INJURY_E = math.round(math.multiply(snapshoot.SS_FIDUCIAL_INJURY, snapshoot.SS_RATIO_INJURY_E, 0.01), 2)
          snapshoot.SS_PAY_INJURY_PS = math.round(math.multiply(snapshoot.SS_FIDUCIAL_INJURY, snapshoot.SS_RATIO_INJURY_PS, 0.01), 2)
          snapshoot.SS_PAY_INJURY_ES = math.round(math.multiply(snapshoot.SS_FIDUCIAL_INJURY, snapshoot.SS_RATIO_INJURY_ES, 0.01), 2)
          snapshoot.SS_PAY_CR_FUND_P = math.round(math.multiply(snapshoot.SS_FIDUCIAL_CR_FUND, snapshoot.SS_RATIO_CR_FUND_P, 0.01), 2)
          snapshoot.SS_PAY_CR_FUND_E = math.round(math.multiply(snapshoot.SS_FIDUCIAL_CR_FUND, snapshoot.SS_RATIO_CR_FUND_E, 0.01), 2)
          snapshoot.SS_PAY_CR_FUND_PS = math.round(math.multiply(snapshoot.SS_FIDUCIAL_CR_FUND_S, snapshoot.SS_RATIO_CR_FUND_PS, 0.01), 2)
          snapshoot.SS_PAY_CR_FUND_ES = math.round(math.multiply(snapshoot.SS_FIDUCIAL_CR_FUND_S, snapshoot.SS_RATIO_CR_FUND_ES, 0.01), 2)
          ref.handleDialogInput(snapshoot)
        } else {
          this.$message({
            showClose: true,
            message: '未找到指定员工薪资信息',
            type: 'warning'
          })
        }
        ref.loading = false
      })
    }
  }
}
</script>
