<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <salary-snapshoot-edit ref="ref-salary-snapshoot-edit" :enterprise-options="enterpriseOptions" @after-save="refresh" />
    <salary-snapshoot-import ref="ref-salary-snapshoot-import" @after-save="refresh" />
    <verify-result-list ref="ref-verify-result-list" operate="edit" @after-close="refresh" />
    <a-d-snapshoot-list ref="ref-a-d-snapshoot-list" operate="edit" @after-close="refresh" />
    <flow-record-list ref="ref-flow-record-list" />
  </div>
</template>

<script>
import * as validator from '@/utils/validate'
import {
  salarySnapshootList,
  salarySnapshootDelete,
  verifyUpdateById,
  verifyUpdateByQuery,
  salarySnapshootUpdateById,
  salarySnapshootUpdateByQuery,
  enterpriseList
} from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import { buildFlowRecordSimple, getSalarySnapshootId, getSalarySnapshootSearcher, getSalarySnapshootTableItems } from './kit'
import SalarySnapshootEdit from './salarySnapshootEdit'
import SalarySnapshootImport from './salarySnapshootImport'
import VerifyResultList from './verifyResultList'
import ADSnapshootList from './adSnapshootList'
import FlowRecordList from './flowRecordList'

export default {
  name: 'SalaryGatherList',
  components: { TypographyTableBasic, SalarySnapshootEdit, SalarySnapshootImport, VerifyResultList, ADSnapshootList, FlowRecordList },
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
        const ejData = {
          on: { 'click': () => self.showEdit(salarySnapshoot) }
        }
        actions.push(<el-button type='text' { ...ejData }>编辑</el-button>)
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
            text: '新增',
            props: {
              icon: 'el-icon-antd-plus'
            },
            events: {
              click: function() {
                self.showEdit({})
              }
            }
          },
          {
            text: '导入',
            props: {
              icon: 'el-icon-antd-Import'
            },
            events: {
              click: function() {
                self.importSalarySnapshoot()
              }
            }
          },
          {
            selectedRowVisible: true,
            text: '删除',
            props: {
              icon: 'el-icon-antd-delete',
              type: 'danger',
              plain: true
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (validator.isNotEmpty(selectedRows)) {
                  self.$confirm('是否删除数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const salarySnapshoots = selectedRows.map(selectedRow => {
                      return getSalarySnapshootId(selectedRow)
                    })
                    salarySnapshootDelete(salarySnapshoots).then(response => {
                      self.refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          },
          {
            text: '校验',
            props: {
              icon: 'el-icon-antd-error',
              type: 'warning',
              plain: true
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (validator.isNotEmpty(selectedRows)) {
                  self.$confirm('是否校验数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    let count = 0
                    const salarySnapshoots = []
                    selectedRows.forEach(selectedRow => {
                      const SS_VERIFY_STATUS = selectedRow.SS_VERIFY_STATUS
                      if (SS_VERIFY_STATUS === '01') {
                        const salarySnapshoot = getSalarySnapshootId(selectedRow)
                        salarySnapshoots.push(salarySnapshoot)
                      } else {
                        count++
                      }
                    })
                    verifyUpdateById(salarySnapshoots).then(response => {
                      if (count !== 0) {
                        self.$message({
                          showClose: true,
                          message: `有 ${count} 条数据已执行校验，系统已自动剔除`,
                          type: 'warning'
                        })
                      }
                      self.refresh()
                    })
                  }).catch(() => {})
                } else {
                  self.$confirm('是否校验全部（可校验的）数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const querier = self.$refs['ref'].getQuerier()
                    verifyUpdateByQuery(querier).then(response => {
                      const count = response.data
                      if (count !== 0) {
                        self.$message({
                          showClose: true,
                          message: `有 ${count} 条数据已执行校验，系统已自动剔除`,
                          type: 'warning'
                        })
                      }
                      self.refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          },
          {
            text: '提交',
            props: {
              icon: 'el-icon-antd-verticalleft',
              type: 'success',
              plain: true
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (validator.isNotEmpty(selectedRows)) {
                  self.$confirm('是否提交数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    let count = 0
                    const salarySnapshoots = []
                    selectedRows.forEach(selectedRow => {
                      const SS_STATUS = selectedRow.SS_STATUS
                      const SS_VERIFY_STATUS = selectedRow.SS_VERIFY_STATUS
                      if (SS_VERIFY_STATUS === '02' || SS_VERIFY_STATUS === '03') {
                        const salarySnapshoot = getSalarySnapshootId(selectedRow)
                        Object.assign(salarySnapshoot, {
                          SS_STATUS: '04',
                          FLOW_RECORD: buildFlowRecordSimple('01', '01', '', SS_STATUS, '04')
                        })
                        salarySnapshoots.push(salarySnapshoot)
                      } else {
                        count++
                      }
                    })
                    salarySnapshootUpdateById(salarySnapshoots).then(response => {
                      if (count !== 0) {
                        self.$message({
                          showClose: true,
                          message: `有 ${count} 条数据未校验或校验预警，无法执行提交，系统已自动剔除`,
                          type: 'warning'
                        })
                      }
                      self.refresh()
                    })
                  }).catch(() => {})
                } else {
                  self.$confirm('是否提交全部（可提交的）数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const querier = self.$refs['ref'].getQuerier()
                    salarySnapshootUpdateByQuery(querier, {
                      SS_STATUS: '04',
                      FLOW_RECORD: buildFlowRecordSimple('01', '01', '', '', '04')
                    }).then(response => {
                      const count = response.data
                      if (count !== 0) {
                        self.$message({
                          showClose: true,
                          message: `有 ${count} 条数据未校验或校验预警，无法执行提交，系统已自动剔除`,
                          type: 'warning'
                        })
                      }
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
      return getSalarySnapshootSearcher(this.enterpriseOptions, ['01', '02', '03'])
    }
  },
  created() {
    enterpriseList({}).then(response => {
      this.enterpriseOptions = response.data.items
    })
  },
  methods: {
    refresh(config) {
      if (validator.isNotEmpty(config)) {
        if (config.refreshFlag) {
          this.$refs['ref'].doSearch()
        }
      } else {
        this.$refs['ref'].doSearch()
      }
    },
    showEdit(salarySnapshoot) {
      this.$refs['ref-salary-snapshoot-edit'].showDialog(salarySnapshoot)
    },
    importSalarySnapshoot() {
      this.$refs['ref-salary-snapshoot-import'].showDialog()
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
