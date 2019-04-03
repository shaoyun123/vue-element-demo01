<template>
  <div>
    <ty-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <payroll-export ref="ref-payroll-export" />
    <payroll-view ref="ref-payroll-view" :enterprise-options="enterpriseOptions" />
    <flow-record-list ref="ref-flow-record-list" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { payrollList, payrollUpdateById, payrollUpdateByQuery, enterpriseList } from '@/api/pit'
import TyTableBasic from '@/components/Typography/Table/basic'
import { buildFlowRecordSimple, getPayrollId, getPayrollSearcher, getPayrollTableItems } from './kit'
import PayrollExport from './payrollExport'
import PayrollView from './payrollView'
import FlowRecordList from './flowRecordList'

export default {
  name: 'SalaryConfirmList',
  components: { TyTableBasic, PayrollExport, PayrollView, FlowRecordList },
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
        const actions = []
        const vjData = {
          on: { 'click': () => self.showView(payroll) }
        }
        actions.push(<el-button type='text' { ...vjData }>查看</el-button>)
        return actions
      }
    })
    return {
      controller: {
        items: [
          {
            text: '导出发放单',
            props: {
              icon: 'el-icon-antd-export'
            },
            events: {
              click: function() {
                self.payrollExport()
              }
            }
          },
          {
            text: '已发放',
            props: {
              icon: 'el-icon-antd-carryout',
              type: 'success'
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (isNotEmpty(selectedRows)) {
                  self.$confirm('是否将工资单置为已发放 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    let count = 0
                    const payrolls = []
                    selectedRows.forEach(selectedRow => {
                      const P_STATUS = selectedRow.P_STATUS
                      if (P_STATUS === '08') {
                        const payroll = getPayrollId(selectedRow)
                        Object.assign(payroll, {
                          P_STATUS: '09',
                          FLOW_RECORD: buildFlowRecordSimple('02', '07', '', P_STATUS, '09')
                        })
                        payrolls.push(payroll)
                      } else {
                        count++
                      }
                    })
                    payrollUpdateById(payrolls).then(response => {
                      if (count !== 0) {
                        self.$message({
                          showClose: true,
                          message: `有 ${count} 条数据已置为已发放状态，系统已自动剔除`,
                          type: 'warning'
                        })
                      }
                      self.refresh()
                    })
                  }).catch(() => {})
                } else {
                  self.$confirm('是否将全部工资单置为已发放 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const querier = self.$refs['ref'].getQuerier()
                    payrollUpdateByQuery(querier, {
                      P_STATUS: '09',
                      FLOW_RECORD: buildFlowRecordSimple('02', '07', '', '', '09')
                    }).then(response => {
                      self.refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          }
        ]
      },
      table: { items: tableItems },
      paginationMethod: payrollList,
      enterpriseOptions: []
    }
  },
  computed: {
    searcher: function() {
      return getPayrollSearcher(['08', '09'])
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
    payrollExport() {
      this.$refs['ref-payroll-export'].showDialog()
    },
    showView(payroll) {
      this.$refs['ref-payroll-view'].showDialog(payroll)
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
