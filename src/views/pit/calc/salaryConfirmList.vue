<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <salary-snapshoot-view ref="ref-salary-snapshoot-view" :enterprise-options="enterpriseOptions" />
    <verify-result-list ref="ref-verify-result-list" operate="view" />
    <a-d-snapshoot-list ref="ref-a-d-snapshoot-list" operate="view" />
    <flow-record-list ref="ref-flow-record-list" />
  </div>
</template>

<script>
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { salarySnapshootList, salarySnapshootUpdateById, salarySnapshootUpdateByQuery, enterpriseList } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import { buildFlowRecordSimple, getSalarySnapshootId, getSalarySnapshootSearcher, getSalarySnapshootTableItems } from './kit'
import SalarySnapshootView from './salarySnapshootView'
import VerifyResultList from './verifyResultList'
import ADSnapshootList from './adSnapshootList'
import FlowRecordList from './flowRecordList'

export default {
  name: 'SalaryConfirmList',
  components: { TypographyTableBasic, SalarySnapshootView, VerifyResultList, ADSnapshootList, FlowRecordList },
  data() {
    const self = this
    const tableItems = getSalarySnapshootTableItems({
      'SS_STATUS': function(salarySnapshoot, row) {
        const actions = []
        const jsxData = {
          on: { 'click': () => self.showFlowRecords(salarySnapshoot) }
        }
        actions.push(<el-button type='text' icon='el-icon-antd-audit' { ...jsxData } />)
        actions.push(self.$store.getters.getDictTitle('S4Y_S7T_SS_STATUS', row.SS_STATUS))
        return actions
      },
      'action': function(salarySnapshoot, row) {
        const actions = []
        const SS_TYPE = row.SS_TYPE
        const SS_VERIFY_STATUS = row.SS_VERIFY_STATUS
        const sjData = {
          on: { 'click': () => self.showView(salarySnapshoot) }
        }
        actions.push(<el-button type='text' { ...sjData }>查看</el-button>)
        if (SS_VERIFY_STATUS === '03' || SS_VERIFY_STATUS === '04') {
          const vjData = {
            on: { 'click': () => self.showVerifyResults(salarySnapshoot) }
          }
          actions.push(<el-button type='text' { ...vjData }>校验结果</el-button>)
        }
        if (SS_TYPE === '01') {
          const ajData = {
            on: { 'click': () => self.showADSnapshoots(salarySnapshoot) }
          }
          actions.push(<el-button type='text' { ...ajData }>附加扣除</el-button>)
        }
        return actions
      }
    })
    return {
      controller: {
        items: [
          {
            text: '确认',
            props: {
              icon: 'el-icon-antd-verticalleft',
              type: 'success',
              plain: true
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (isNotEmpty(selectedRows)) {
                  self.$confirm('是否确认薪资并生成工资单 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const salarySnapshoots = selectedRows.map(selectedRow => {
                      const salarySnapshoot = getSalarySnapshootId(selectedRow)
                      const SS_STATUS = selectedRow.SS_STATUS
                      Object.assign(salarySnapshoot, {
                        SS_STATUS: '06',
                        FLOW_RECORD: buildFlowRecordSimple('01', '03', '', SS_STATUS, '06')
                      })
                      return salarySnapshoot
                    })
                    salarySnapshootUpdateById(salarySnapshoots).then(response => {
                      self.refresh()
                    })
                  }).catch(() => {})
                } else {
                  self.$confirm('是否确认薪资并生成全部工资单 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const querier = self.$refs['ref'].getQuerier()
                    salarySnapshootUpdateByQuery(querier, {
                      SS_STATUS: '06',
                      FLOW_RECORD: buildFlowRecordSimple('01', '03', '', '', '06')
                    }).then(response => {
                      self.refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          },
          {
            selectedRowVisible: true,
            text: '打回',
            props: {
              icon: 'el-icon-antd-verticalright',
              type: 'danger',
              plain: true
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (isNotEmpty(selectedRows)) {
                  self.$prompt('请输入打回原因', '打回', {
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '提交',
                    showCancelButton: false,
                    inputValidator: (value) => {
                      if (isEmpty(value)) {
                        return '请输入打回原因'
                      }
                      return true
                    }
                  }).then(({ value }) => {
                    const salarySnapshoots = selectedRows.map(selectedRow => {
                      const salarySnapshoot = getSalarySnapshootId(selectedRow)
                      const SS_STATUS = selectedRow.SS_STATUS
                      Object.assign(salarySnapshoot, {
                        SS_STATUS: '02',
                        FLOW_RECORD: buildFlowRecordSimple('01', '02', value, SS_STATUS, '02')
                      })
                      return salarySnapshoot
                    })
                    salarySnapshootUpdateById(salarySnapshoots).then(response => {
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
      paginationMethod: salarySnapshootList,
      enterpriseOptions: []
    }
  },
  computed: {
    searcher: function() {
      return getSalarySnapshootSearcher(this.enterpriseOptions, ['04', '05'])
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
    showView(salarySnapshoot) {
      this.$refs['ref-salary-snapshoot-view'].showDialog(salarySnapshoot)
    },
    showVerifyResults(salarySnapshoot) {
      const PK = {
        VR_BODY_TYPE: '01',
        VR_BODY_ID: JSON.stringify(salarySnapshoot)
      }
      this.$refs['ref-verify-result-list'].showDialog(PK)
    },
    showADSnapshoots(salarySnapshoot) {
      const PK = {
        ADS_FREQ: salarySnapshoot.SS_FREQ,
        ADS_ISSUE: salarySnapshoot.SS_ISSUE,
        ADS_STAFF_NUMBER: salarySnapshoot.SS_STAFF_NUMBER
      }
      this.$refs['ref-a-d-snapshoot-list'].showDialog(PK)
    },
    showFlowRecords(salarySnapshoot) {
      const PK = {
        FR_BODY_TYPE: '01',
        FR_BODY_ID: JSON.stringify(salarySnapshoot)
      }
      this.$refs['ref-flow-record-list'].showDialog(PK)
    }
  }
}
</script>
