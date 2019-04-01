<template>
  <div>
    <basic-view
      ref="ref"
      :dialog-title="dialogTitle"
      :get-entity="getEntity"
      :handle-items="handleItems"
      :actions="actions" />
    <salary-snapshoot-view ref="ref-salary-snapshoot-view" :enterprise-options="enterpriseOptions" />
    <a-d-snapshoot-list ref="ref-a-d-snapshoot-list" operate="view" />
  </div>
</template>

<script>
import * as validator from '@/utils/validate'
import { payrollSingle } from '@/api/pit'
import { getPayrollFormItems } from './kit'
import BasicView from '@/views/components/basicView'
import SalarySnapshootView from './salarySnapshootView'
import ADSnapshootList from './adSnapshootList'

export default {
  name: 'PayrollView',
  components: { BasicView, SalarySnapshootView, ADSnapshootList },
  props: {
    enterpriseOptions: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    const self = this
    return {
      primaryKey: {},
      dialogTitle: '工资单',
      getEntity: payrollSingle,
      actions: [
        {
          float: 'right',
          text: '薪资明细',
          props: {
            icon: 'el-icon-antd-Dollar',
            plain: true
          },
          events: {
            click: self.showSalarySnapshoot
          }
        },
        {
          float: 'right',
          text: '附加扣除',
          props: {
            icon: 'el-icon-antd-piechart',
            plain: true
          },
          events: {
            click: self.showADSnapshoots
          }
        }
      ]
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (
        validator.isNotEmpty(PK) &&
        validator.isNotEmpty(PK.P_FREQ) &&
        validator.isNotEmpty(PK.P_ISSUE) &&
        validator.isNotEmpty(PK.P_STAFF_NUMBER) &&
        validator.isNotEmpty(PK.P_TYPE)
      ) {
        primaryKey = PK
        this.primaryKey = primaryKey
      }
      this.$refs['ref'].showDialog(primaryKey)
    },
    handleItems(operate, model) {
      return getPayrollFormItems(operate, model)
    },
    showSalarySnapshoot() {
      let primaryKey = null
      if (
        validator.isNotEmpty(this.primaryKey.P_FREQ) &&
        validator.isNotEmpty(this.primaryKey.P_ISSUE) &&
        validator.isNotEmpty(this.primaryKey.P_STAFF_NUMBER) &&
        validator.isNotEmpty(this.primaryKey.P_TYPE)
      ) {
        primaryKey = {
          SS_FREQ: this.primaryKey.P_FREQ,
          SS_ISSUE: this.primaryKey.P_ISSUE,
          SS_STAFF_NUMBER: this.primaryKey.P_STAFF_NUMBER,
          SS_TYPE: this.primaryKey.P_TYPE
        }
      }
      this.$refs['ref-salary-snapshoot-view'].showDialog(primaryKey)
    },
    showADSnapshoots() {
      let primaryKey = null
      if (
        validator.isNotEmpty(this.primaryKey.P_FREQ) &&
        validator.isNotEmpty(this.primaryKey.P_ISSUE) &&
        validator.isNotEmpty(this.primaryKey.P_STAFF_NUMBER) &&
        validator.isNotEmpty(this.primaryKey.P_TYPE)
      ) {
        primaryKey = {
          ADS_FREQ: this.primaryKey.P_FREQ,
          ADS_ISSUE: this.primaryKey.P_ISSUE,
          ADS_STAFF_NUMBER: this.primaryKey.P_STAFF_NUMBER
        }
      }
      this.$refs['ref-a-d-snapshoot-list'].showDialog(primaryKey)
    }
  }
}
</script>
