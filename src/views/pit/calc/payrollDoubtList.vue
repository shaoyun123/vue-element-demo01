<template>
  <div>
    <ty-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <payroll-view ref="ref-payroll-view" :enterprise-options="enterpriseOptions" />
    <flow-record-list ref="ref-flow-record-list" />
  </div>
</template>

<script>
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { payrollList, payrollUpdateById, enterpriseList } from '@/api/pit'
import TyTableBasic from '@/components/Typography/Table/basic'
import { buildFlowRecordSimple, getPayrollId, getPayrollSearcher, getPayrollTableItems } from './kit'
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
            selectedRowVisible: true,
            text: '不调整',
            props: {
              icon: 'el-icon-antd-stop',
              type: 'success'
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (isNotEmpty(selectedRows)) {
                  self.$prompt('请输入不调整原因', '质疑处理', {
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '提交',
                    showCancelButton: false,
                    inputValidator: (value) => {
                      if (isEmpty(value)) {
                        return '请输入不调整原因'
                      }
                      return true
                    }
                  }).then(({ value }) => {
                    const payrolls = selectedRows.map(selectedRow => {
                      const payroll = getPayrollId(selectedRow)
                      const P_STATUS = selectedRow.P_STATUS
                      Object.assign(payroll, {
                        P_STATUS: '06',
                        FLOW_RECORD: buildFlowRecordSimple('02', '06', value, P_STATUS, '06')
                      })
                      return payroll
                    })
                    payrollUpdateById(payrolls).then(response => {
                      self.refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          },
          {
            selectedRowVisible: true,
            text: '调整',
            props: {
              icon: 'el-icon-antd-control',
              type: 'danger'
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (isNotEmpty(selectedRows)) {
                  self.$prompt('请输入调整原因', '质疑处理', {
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '提交',
                    showCancelButton: false,
                    inputValidator: (value) => {
                      if (isEmpty(value)) {
                        return '请输入调整原因'
                      }
                      return true
                    }
                  }).then(({ value }) => {
                    const payrolls = selectedRows.map(selectedRow => {
                      const payroll = getPayrollId(selectedRow)
                      const P_STATUS = selectedRow.P_STATUS
                      Object.assign(payroll, {
                        P_STATUS: '05',
                        FLOW_RECORD: buildFlowRecordSimple('02', '05', value, P_STATUS, '05')
                      })
                      return payroll
                    })
                    payrollUpdateById(payrolls).then(response => {
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
      return getPayrollSearcher(['04'])
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
