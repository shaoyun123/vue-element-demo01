<template>
  <div>
    <ty-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <payroll-view ref="ref-payroll-view" :enterprise-options="enterpriseOptions" />
    <flow-record-list ref="ref-flow-record-list" />
  </div>
</template>

<script>
import { isEmpty } from '@/utils/validate'
import { payrollList, payrollUpdateById, enterpriseList } from '@/api/pit'
import TyTableBasic from '@/components/Typography/Table/Basic'
import { buildFlowRecordSimple, getPayrollSearcher, getPayrollTableItems } from './kit'
import PayrollView from './payrollView'
import FlowRecordList from './flowRecordList'

export default {
  name: 'SalaryConfirmList',
  components: { TyTableBasic, PayrollView, FlowRecordList },
  data() {
    const self = this
    const tableItems = getPayrollTableItems({
      'P_STATUS': function(payroll, row) {
        const actions = []
        const jsxData = {
          on: { 'click': () => self.showFlowRecords(payroll) }
        }
        actions.push(<el-button type='text' icon='el-icon-antd-audit' { ...jsxData } />)
        actions.push(self.$store.getters.getDictTitle('P5L_P_STATUS', row.P_STATUS))
        return actions
      },
      'action': function(payroll, row) {
        const P_STATUS = row.P_STATUS
        const actions = []
        const vjData = {
          on: { 'click': () => self.showView(payroll) }
        }
        actions.push(<el-button type='text' { ...vjData }>查看</el-button>)
        if (P_STATUS === '01' || P_STATUS === '02') {
          const djData = {
            on: { 'click': () => self.showDoubt(payroll, row) }
          }
          actions.push(<el-button type='text' { ...djData }>质疑</el-button>)
        }
        return actions
      }
    })
    return {
      controller: { items: [] },
      table: { items: tableItems },
      paginationMethod: payrollList,
      enterpriseOptions: []
    }
  },
  computed: {
    searcher: function() {
      return getPayrollSearcher(['01', '02', '03', '04', '05'])
    }
  },
  created() {
    enterpriseList({}).then(response => {
      this.enterpriseOptions = response.data.items
    })
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showView(payroll) {
      this.$refs['ref-payroll-view'].showDialog(payroll)
    },
    showDoubt(payroll, row) {
      const self = this
      const P_STATUS = row.P_STATUS
      if (P_STATUS === '03') {
        self.$message({
          showClose: true,
          message: '工资单已被打回，请等待处理结果',
          type: 'warning'
        })
        return
      } else if (P_STATUS === '04') {
        self.$message({
          showClose: true,
          message: '已对工资单发起质疑，请等待处理结果',
          type: 'warning'
        })
        return
      } else if (P_STATUS === '05') {
        self.$message({
          showClose: true,
          message: '工资单已确认调整，请等待处理结果',
          type: 'warning'
        })
        return
      }
      self.$prompt('请输入质疑原因', '质疑', {
        confirmButtonClass: 'el-icon-antd-check',
        confirmButtonText: '提交',
        showCancelButton: false,
        inputValidator: (value) => {
          if (isEmpty(value)) {
            return '请输入质疑原因'
          }
          return true
        }
      }).then(({ value }) => {
        Object.assign(payroll, {
          P_STATUS: '04',
          FLOW_RECORD: buildFlowRecordSimple('02', '04', value, P_STATUS, '04')
        })
        const payrolls = [payroll]
        payrollUpdateById(payrolls).then(response => {
          self.refresh()
        })
      }).catch(() => {})
    },
    showFlowRecords(payroll) {
      const PK = {
        FR_BODY_TYPE: '02',
        FR_BODY_ID: JSON.stringify(payroll)
      }
      this.$refs['ref-flow-record-list'].showDialog(PK)
    }
  }
}
</script>
