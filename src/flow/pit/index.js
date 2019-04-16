import moment from 'moment'
import { parallel } from '@/utils/request'
import { isNotEmpty } from '@/utils/validate'
import { showMessage, showConfirm, showPrompt } from '@/utils/element'
import { buildTableActions, buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'
import {
  enterpriseList,
  salarySnapshootList,
  salarySnapshootDelete,
  salarySnapshootSingle,
  salarySnapshootSave,
  salarySnapshootImport,
  verifyUpdateById,
  verifyUpdateByQuery,
  salarySnapshootUpdateById,
  salarySnapshootUpdateByQuery,
  verifyResultList,
  verifyResultUpdateById,
  adSnapshootList,
  adSnapshootUpdateById,
  flowRecordList,
  payrollList,
  payrollSingle,
  payrollUpdateById,
  payrollUpdateByQuery
} from '@/api/pit'
import * as sskit from './salary-snapshoot'
import * as pkit from './payroll'

function buildFlowRecord(vm, FR_BODY_TYPE, FR_OPERATE_CODE, FR_OPERATE_DESCR, FR_OPERATE_SB_CODE, FR_OPERATE_SA_CODE) {
  let dictType = ''
  if (FR_BODY_TYPE === '01') {
    dictType = 'S4Y_S7T_SS_STATUS'
  } else if (FR_BODY_TYPE === '02') {
    dictType = 'P5L_P_STATUS'
  }
  const { getDictTitle } = vm.$store.getters
  const FR_OPERATE_TITLE = getDictTitle('OPERATE_CODE', FR_OPERATE_CODE)
  const FR_OPERATE_SB_TITLE = getDictTitle(dictType, FR_OPERATE_SB_CODE)
  const FR_OPERATE_SA_TITLE = getDictTitle(dictType, FR_OPERATE_SA_CODE)
  const flowRecord = { FR_BODY_TYPE, FR_OPERATE_CODE, FR_OPERATE_TITLE, FR_OPERATE_SA_CODE, FR_OPERATE_SA_TITLE }
  if (isNotEmpty(FR_OPERATE_DESCR)) {
    flowRecord.FR_OPERATE_DESCR = FR_OPERATE_DESCR
  }
  if (isNotEmpty(FR_OPERATE_SB_CODE)) {
    flowRecord.FR_OPERATE_SB_CODE = FR_OPERATE_SB_CODE
  }
  if (isNotEmpty(FR_OPERATE_SB_TITLE)) {
    flowRecord.FR_OPERATE_SB_TITLE = FR_OPERATE_SB_TITLE
  }
  return flowRecord
}

function verify(vm) {
  const selectedRows = vm.getFlowActionData()
  if (isNotEmpty(selectedRows)) {
    showConfirm({ content: '是否校验数据 ？', type: 'warning' }).then(() => {
      let count = 0
      const pks = []
      selectedRows.forEach(selectedRow => {
        const SS_VERIFY_STATUS = selectedRow.SS_VERIFY_STATUS
        if (SS_VERIFY_STATUS === '01') {
          const pk = sskit.getPrimaryKey(selectedRow)
          pks.push(pk)
        } else {
          count++
        }
      })
      verifyUpdateById(pks).then(response => {
        if (count !== 0) {
          showMessage({ content: `有 ${count} 条数据已执行校验，系统已自动剔除`, type: 'warning' })
        }
        vm.refresh()
      })
    }).catch(() => {})
  } else {
    showConfirm({ content: '是否校验全部数据 ？', type: 'warning' }).then(() => {
      const querier = vm.ref().getQuerier()
      verifyUpdateByQuery(querier).then(response => {
        const count = response.data
        if (count !== 0) {
          showMessage({ content: `有 ${count} 条数据已执行校验，系统已自动剔除`, type: 'warning' })
        }
        vm.refresh()
      })
    }).catch(() => {})
  }
}

function deleteSalarySnapshoot(vm) {
  const selectedRows = vm.getFlowActionData()
  if (isNotEmpty(selectedRows)) {
    showConfirm({ content: '是否删除数据 ？', type: 'warning' }).then(() => {
      const salarySnapshoots = selectedRows.map(selectedRow => {
        return sskit.getPrimaryKey(selectedRow)
      })
      salarySnapshootDelete(salarySnapshoots).then(response => {
        vm.refresh()
      })
    }).catch(() => {})
  }
}

function updateSalarySnapshootById(vm, selectedRows, flowRecord) {
  let count = 0
  const pks = []
  const { routerName, operateCode, to, remark } = flowRecord
  selectedRows.forEach(selectedRow => {
    const SS_STATUS = selectedRow.SS_STATUS
    const SS_VERIFY_STATUS = selectedRow.SS_VERIFY_STATUS
    if (
      (routerName === 'PIT-SalaryGather' && (SS_VERIFY_STATUS === '02' || SS_VERIFY_STATUS === '03')) ||
      routerName === 'PIT-SalaryConfirm'
    ) {
      const FLOW_RECORD = buildFlowRecord(vm, '01', operateCode, remark, SS_STATUS, to.SS_STATUS)
      const pk = sskit.getPrimaryKey(selectedRow)
      Object.assign(pk, to, { FLOW_RECORD })
      pks.push(pk)
    } else {
      count++
    }
  })
  salarySnapshootUpdateById(pks).then(response => {
    if (count !== 0) {
      showMessage({ content: `有 ${count} 条数据未校验或校验预警，无法执行提交，系统已自动剔除`, type: 'warning' })
    }
    vm.refresh()
  })
}

function updateSalarySnapshootByQuery(vm, querier, flowRecord) {
  const { operateCode, to, remark } = flowRecord
  const FLOW_RECORD = buildFlowRecord(vm, '01', operateCode, remark, '', to.SS_STATUS)
  salarySnapshootUpdateByQuery(querier, Object.assign({}, to, { FLOW_RECORD })).then(response => {
    const count = response.data
    if (count !== 0) {
      showMessage({ content: `有 ${count} 条数据未校验或校验预警，无法执行提交，系统已自动剔除`, type: 'warning' })
    }
    vm.refresh()
  })
}

function updatePayrollById(vm, selectedRows, flowRecord) {
  let count = 0
  const pks = []
  const { routerName, operateCode, to, remark } = flowRecord
  selectedRows.forEach(selectedRow => {
    const P_STATUS = selectedRow.P_STATUS
    if (
      (routerName === 'PIT-PayrollConfirm' && (P_STATUS === '01' || P_STATUS === '02')) ||
      routerName === 'PIT-PayrollDoubt' ||
      routerName === 'PIT-PayrollSubmit' ||
      (routerName === 'PIT-PayrollFeedback' && P_STATUS === '08')
    ) {
      const FLOW_RECORD = buildFlowRecord(vm, '02', operateCode, remark, P_STATUS, to.P_STATUS)
      const pk = pkit.getPrimaryKey(selectedRow)
      Object.assign(pk, to, { FLOW_RECORD })
      pks.push(pk)
    } else {
      count++
    }
  })
  payrollUpdateById(pks).then(response => {
    if (count !== 0) {
      if (routerName === 'PIT-PayrollConfirm') {
        showMessage({ content: `有 ${count} 条数据已被打回、已发起质疑或已确认调整，系统已自动剔除`, type: 'warning' })
      } else if (routerName === 'PIT-PayrollFeedback') {
        showMessage({ content: `有 ${count} 条数据已置为已发放状态，系统已自动剔除`, type: 'warning' })
      }
    }
    vm.refresh()
  })
}

function updatePayrollByQuery(vm, querier, flowRecord) {
  const { routerName, operateCode, to, remark } = flowRecord
  const FLOW_RECORD = buildFlowRecord(vm, '02', operateCode, remark, '', to.P_STATUS)
  payrollUpdateByQuery(querier, Object.assign({}, to, { FLOW_RECORD })).then(response => {
    const count = response.data
    if (count !== 0) {
      if (routerName === 'PIT-PayrollConfirm') {
        showMessage({ content: `有 ${count} 条数据已被打回、已发起质疑或已确认调整，系统已自动剔除`, type: 'warning' })
      } else if (routerName === 'PIT-PayrollFeedback') {
        showMessage({ content: `有 ${count} 条数据已置为已发放状态，系统已自动剔除`, type: 'warning' })
      }
    }
    vm.refresh()
  })
}

function updateADSnapshootById(vm, selectedRows, descr) {
  let count = 0
  const pks = []
  selectedRows.forEach(selectedRow => {
    const ADS_VERIFY_STATUS = selectedRow.ADS_VERIFY_STATUS
    if (ADS_VERIFY_STATUS === '04') {
      pks.push({
        ADS_FREQ: selectedRow.ADS_FREQ,
        ADS_ISSUE: selectedRow.ADS_ISSUE,
        ADS_STAFF_NUMBER: selectedRow.ADS_STAFF_NUMBER,
        ADS_VERIFY_STATUS: '03',
        ADS_DISPOSE_DESCR: descr
      })
    } else {
      count++
    }
  })
  adSnapshootUpdateById(pks).then(response => {
    if (count !== 0) {
      showMessage({ content: `有 ${count} 条数据已处理，系统已自动剔除`, type: 'warning' })
    }
    vm.refresh()
  })
}

function updateVerifyResultById(vm, selectedRows, descr) {
  let count = 0
  const pks = []
  selectedRows.forEach(selectedRow => {
    const VR_STATUS = selectedRow.VR_STATUS
    if (VR_STATUS === '02') {
      pks.push({
        VR_ID: selectedRow.VR_ID,
        VR_STATUS: '03',
        VR_DISPOSE_DESCR: descr
      })
    } else {
      count++
    }
  })
  verifyResultUpdateById(pks).then(response => {
    if (count !== 0) {
      showMessage({ content: `有 ${count} 条数据已处理，系统已自动剔除`, type: 'warning' })
    }
    vm.refresh()
  })
}

const SM_SSL2t = () => {
  return {
    components: function(vm, scopeMeta) {
      const { routerName } = scopeMeta
      const components = []
      if (routerName === 'PIT-SalaryGather') {
        components.push({
          name: 'SalarySnapshootEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
          props: { scope: 'SalarySnapshootEdit' },
          events: { 'after-save': () => vm.refresh() }
        })
        components.push({
          name: 'SalarySnapshootImport', component: () => import(`@/components/Typography/Flow/DialogForm`),
          props: { scope: 'SalarySnapshootImport' },
          events: { 'after-save': () => vm.refresh() }
        })
        components.push({
          name: 'VerifyResultListEdit', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'VerifyResultListEdit' },
          events: { 'after-close': (data) => data.refreshFlag && vm.refresh() }
        })
        components.push({
          name: 'ADSnapshootListEdit', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'ADSnapshootListEdit' },
          events: { 'after-close': (data) => data.refreshFlag && vm.refresh() }
        })
        components.push({
          name: 'FlowRecordList', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'FlowRecordList' }
        })
      } else if (routerName === 'PIT-SalaryConfirm') {
        components.push({
          name: 'SalarySnapshootView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
          props: { scope: 'SalarySnapshootView' }
        })
        components.push({
          name: 'VerifyResultListView', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'VerifyResultListView' }
        })
        components.push({
          name: 'ADSnapshootListView', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'ADSnapshootListView' }
        })
        components.push({
          name: 'FlowRecordList', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'FlowRecordList' }
        })
      }
      return components
    },
    flowActions: function(vm, scopeMeta) {
      const { routerName } = scopeMeta
      const flowActions = []
      if (routerName === 'PIT-SalaryGather') {
        flowActions.push({
          code: '01', title: '提交', icon: 'el-icon-antd-verticalleft', type: 'success', 'all-in': true, 'status-to': { SS_STATUS: '04' },
          click: function(data, flowRecord, allin) {
            if (allin === true) {
              updateSalarySnapshootByQuery(vm, data, flowRecord)
            } else {
              updateSalarySnapshootById(vm, data, flowRecord)
            }
          }
        })
      } else if (routerName === 'PIT-SalaryConfirm') {
        flowActions.push({
          code: '03', title: '确认', icon: 'el-icon-antd-verticalleft', type: 'success', 'all-in': true, 'status-to': { SS_STATUS: '06' },
          click: function(data, flowRecord, allin) {
            if (allin === true) {
              updateSalarySnapshootByQuery(vm, data, flowRecord)
            } else {
              updateSalarySnapshootById(vm, data, flowRecord)
            }
          }
        })
        flowActions.push({
          code: '02', title: '打回', icon: 'el-icon-antd-verticalright', type: 'danger', 'status-to': { SS_STATUS: '02' }, remark: true,
          click: function(data, flowRecord, allin) {
            updateSalarySnapshootById(vm, data, flowRecord)
          }
        })
      }
      return flowActions
    },
    controller: function(vm, scopeMeta) {
      const { routerName } = scopeMeta
      const items = []
      if (routerName === 'PIT-SalaryGather') {
        items.push({
          text: '新增', props: { icon: 'el-icon-antd-plus' }, events: { click: () => vm.ref('SalarySnapshootEdit').showDialog({}) }
        })
        items.push({
          text: '导入', props: { icon: 'el-icon-antd-Import' }, events: { click: () => vm.ref('SalarySnapshootImport').showDialog() }
        })
        items.push({
          selectedRowVisible: true, text: '删除', props: { icon: 'el-icon-antd-delete', type: 'danger' }, events: { click: () => deleteSalarySnapshoot(vm) }
        })
        items.push({
          text: '校验', props: { icon: 'el-icon-antd-error', type: 'warning' }, events: { click: () => verify(vm) }
        })
      } else if (routerName === 'PIT-SalaryConfirm') {
        // empty
      }
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return sskit.getSearcher(vm, scopeMeta, { enterpriseOptions })
    },
    table: function(vm, scopeMeta) {
      return sskit.getTable(vm, scopeMeta)
    },
    paginationMethod: function(vm, scopeMeta) {
      return salarySnapshootList
    }
  }
}
const SM_SSE2t = () => {
  return {
    dialogTitle: function(vm, scopeMeta) {
      return '薪金采集'
    },
    defaultModel: function(vm, scopeMeta) {
      return {
        SS_SALARY_LOADED: false,
        SS_FREQ: 'M',
        SS_ISSUE: moment().subtract(1, 'months').format('YYYY-MM'),
        SS_TYPE: '01'
      }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return sskit.getFormItems(vm, scopeMeta, operate, model, { enterpriseOptions })
      }
    },
    getMethod: function(vm, scopeMeta) {
      return salarySnapshootSingle
    },
    saveMethod: function(vm, scopeMeta) {
      return salarySnapshootSave
    },
    beforeSave(vm, scopeMeta) {
      return (operate, model) => {
        const SS_SALARY_LOADED = model.SS_SALARY_LOADED
        if (operate === 'add' && !SS_SALARY_LOADED) {
          showMessage({ content: '尚未加载指定员工薪资信息', type: 'warning' })
          return false
        } else {
          vm.$emit('before-save', model)
        }
      }
    }
  }
}
const SM_SSI4t = () => {
  return {
    dialogTitle: function(vm, scopeMeta) {
      return '薪金批量采集'
    },
    controller: function(vm, scopeMeta) {
      return {
        showReset: false,
        items: [
          {
            float: 'left', text: '下载模板', props: { icon: 'el-icon-antd-table' }, events: { click: () => alert('下载模板') }
          },
          {
            float: 'right', text: '导  入', props: { icon: 'el-icon-antd-Import', type: 'primary' },
            events: {
              click: () => {
                vm.ref().validateForm().then(valid => {
                  if (valid) {
                    const model = vm.getModel()
                    salarySnapshootImport(model).then(response => {
                      vm.hideDialog()
                      vm.$emit('after-save')
                    })
                  }
                })
              }
            }
          }
        ]
      }
    },
    defaultModel: function(vm, scopeMeta) {
      return {
        SS_FREQ: 'M',
        SS_ISSUE: moment().subtract(1, 'months').format('YYYY-MM'),
        SS_TYPE: '01',
        SS_PREDICT_PAY_DATE: moment().add(10, 'days').format('YYYY-MM-DD'),
        SS_IMPORT_MODE: '01',
        SS_FILE: null
      }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return [
          {
            props: { label: '频度', prop: 'SS_FREQ' },
            items: buildFormItemsByDicts('S4Y_S7T_SS_FREQ', 'el-radio', 'SS_FREQ')
          },
          {
            props: {
              label: '期次号', prop: 'SS_ISSUE',
              rules: [
                { required: true, message: '请选择期次号', trigger: 'blur' }
              ]
            },
            items: [
              {
                tag: 'el-date-picker', name: 'SS_ISSUE', props: { type: 'month' }
              }
            ]
          },
          {
            props: { label: '薪金类型', prop: 'SS_TYPE' },
            items: buildFormItemsByDicts('S4Y_S7T_SS_TYPE', 'el-radio', 'SS_TYPE')
          },
          {
            props: {
              label: '预计发放日期', prop: 'SS_PREDICT_PAY_DATE',
              rules: [
                { required: true, message: '请选择预计发放日期', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-date-picker', name: 'SS_PREDICT_PAY_DATE' }
            ]
          },
          {
            tip: `
              自动模式：遇到已存在的数据跳过<p>
              覆盖模式：遇到已存在的数据覆盖<p>
              调整模式：遇到已存在的数据合并<p>
              <span style="color: #f56c6c;">*</span> 导入只会对 [待处理、打回、待调整] 三种状态的数据造成影响
            `,
            props: { label: '导入模式', prop: 'SS_IMPORT_MODE' },
            items: buildFormItems([
              { value: '01', title: '自动' },
              { value: '02', title: '覆盖' },
              { value: '03', title: '调整' }
            ], 'value', 'title', 'el-radio', 'SS_IMPORT_MODE')
          },
          { tag: 'el-new-row' },
          {
            props: {
              label: '数据文件', prop: 'SS_FILE',
              rules: [
                { required: true, message: '请选择数据文件', trigger: 'blur' },
                {
                  validator: (rule, value, callback) => {
                    const type = value.TYPE
                    const size = value.SIZE
                    const messages = []
                    if (
                      type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                      type !== 'application/vnd.ms-excel'
                    ) {
                      messages.push('请选择 xls、xls 类型的文件')
                    }
                    if (size > 10) {
                      messages.push('文件大小应小于 10 M')
                    }
                    if (isNotEmpty(messages)) {
                      let message = ''
                      messages.forEach((text, i) => {
                        if (i > 0) {
                          message += ', '
                        }
                        message += text
                      })
                      callback(new Error(message))
                    } else {
                      callback()
                    }
                  },
                  trigger: 'blur'
                }
              ]
            },
            items: [
              {
                tag: 'el-upload',
                props: {
                  // action 组件要求必填，实际实现使用 base64 处理文件，通过表单提交文件
                  action: '', 'auto-upload': false, accept: '.xls,.xlsx', limit: 1,
                  'on-exceed': function(files, fileList) {
                    showMessage({ content: '如果需要重新选择数据文件，请先将已选中文件的删除', type: 'warning' })
                  },
                  'on-change': function(file, fileList) {
                    const raw = file.raw
                    const name = raw.name
                    const type = raw.type // [xlsx > application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | xls > application/vnd.ms-excel]
                    const size = raw.size / 1024 / 1024 // M
                    const reader = new FileReader()
                    reader.readAsDataURL(raw)
                    reader.onload = function(event) {
                      vm.model.SS_FILE = { NAME: name, TYPE: type, SIZE: size, BODY: this.result }
                    }
                  }
                },
                items: [
                  {
                    tag: 'el-button', text: '选取文件', props: { slot: 'trigger', type: 'primary', plain: true }
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
const SM_SSV2w = () => {
  return {
    dialogTitle: function(vm, scopeMeta) {
      return '薪金明细'
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return sskit.getFormItems(vm, scopeMeta, operate, model, { enterpriseOptions })
      }
    },
    getMethod: function(vm, scopeMeta) {
      return salarySnapshootSingle
    }
  }
}
const SM_VRL2t = (operate) => {
  return {
    dialogTitle: function(vm, scopeMeta) {
      return '校验结果'
    },
    controller: function(vm, scopeMeta) {
      const items = []
      if (operate === 'edit') {
        items.push({
          selectedRowVisible: true, text: '忽略', props: { icon: 'el-icon-antd-stop', type: 'warning' },
          events: {
            click: function() {
              const selectedRows = vm.getFlowActionData()
              if (isNotEmpty(selectedRows)) {
                showPrompt({ content: '请输入忽略原因', text: '忽略' }).then(({ value }) => {
                  updateVerifyResultById(vm, selectedRows, value)
                }).catch(() => {})
              }
            }
          }
        })
      }
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return {
        items: [
          {
            props: { label: '校验状态', prop: 'VR_STATUS' },
            items: [
              { tag: 'el-select', name: 'VR_STATUS', items: buildFormItemsByDicts('V4Y_R4T_VR_STATUS', 'el-option') }
            ]
          }
        ]
      }
    },
    table: function(vm, scopeMeta) {
      const { getDictTitle } = vm.$store.getters
      return {
        items: [
          {
            props: { label: '规则标题', prop: 'VR_RULE_TITLE', fixed: 'left', width: '175' }
          },
          {
            props: {
              label: '状态', prop: 'VR_STATUS', fixed: 'left', align: 'center', width: '100',
              formatter: function(row, column, cellValue, index) {
                const title = getDictTitle('V4Y_R4T_VR_STATUS', cellValue)
                if (cellValue === '03') {
                  return buildTableActions(vm, [
                    { title, click: () => showMessage({ content: row.VR_DISPOSE_DESCR, title: '处理结果', force: true }) }
                  ])
                } else if (cellValue === '02') {
                  return buildTableActions(vm, [
                    { title, click: () => showMessage({ content: row.VR_RESULT, title: '校验结果', force: true }) }
                  ])
                } else {
                  return title
                }
              }
            }
          },
          {
            props: {
              label: '规则描述', prop: 'VR_RULE_DESCR', width: '750', 'show-overflow-tooltip': true,
              formatter: function(row, column, cellValue, index) {
                const h = vm.$createElement
                return h('span', {}, cellValue)
              }
            }
          },
          {
            props: { prop: 'fill' }
          }
        ]
      }
    },
    paginationMethod: function(vm, scopeMeta) {
      return verifyResultList
    }
  }
}
const SM_ADSL2t = (operate) => {
  return {
    dialogTitle: function(vm, scopeMeta) {
      return '附加扣除'
    },
    controller: function(vm, scopeMeta) {
      const items = []
      if (operate === 'edit') {
        items.push({
          selectedRowVisible: true, text: '调平', props: { icon: 'el-icon-antd-control', type: 'warning' },
          events: {
            click: function() {
              const selectedRows = vm.getFlowActionData()
              if (isNotEmpty(selectedRows)) {
                showConfirm({ content: '是否调平数据 ？' }).then(() => {
                  updateADSnapshootById(vm, selectedRows, '已对数据进行调平处理')
                }).catch(() => {})
              }
            }
          }
        })
        items.push({
          selectedRowVisible: true, text: '忽略', props: { icon: 'el-icon-antd-stop', type: 'warning' },
          events: {
            click: function() {
              const selectedRows = vm.getFlowActionData()
              if (isNotEmpty(selectedRows)) {
                showPrompt({ content: '请输入忽略原因', title: '忽略' }).then(({ value }) => {
                  updateADSnapshootById(vm, selectedRows, value)
                }).catch(() => {})
              }
            }
          }
        })
      }
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return {
        items: [
          {
            props: { label: '类型', prop: 'ADS_TYPE' },
            items: [
              { tag: 'el-select', name: 'ADS_TYPE', items: buildFormItemsByDicts('A8L_D4T_S7T_ADS_TYPE', 'el-option') }
            ]
          },
          {
            props: { label: '校验状态', prop: 'ADS_VERIFY_STATUS' },
            items: [
              { tag: 'el-select', name: 'ADS_VERIFY_STATUS', items: buildFormItemsByDicts('A8L_D4T_S7T_ADS_VERIFY_STATUS', 'el-option') }
            ]
          }
        ]
      }
    },
    table: function(vm, scopeMeta) {
      const { getDictTitle } = vm.$store.getters
      return {
        items: [
          {
            props: {
              label: '类型', prop: 'ADS_TYPE', fixed: 'left', width: '125',
              formatter: function(row, column, cellValue, index) {
                return getDictTitle('A8L_D4T_S7T_ADS_TYPE', cellValue)
              }
            }
          },
          {
            props: { label: '标题', prop: 'ADS_TITLE', fixed: 'left', width: '175' }
          },
          {
            props: {
              label: '校验状态', prop: 'ADS_VERIFY_STATUS', fixed: 'left', align: 'center', width: '100',
              formatter: function(row, column, cellValue, index) {
                const title = getDictTitle('A8L_D4T_S7T_ADS_VERIFY_STATUS', cellValue)
                if (cellValue === '03') {
                  return buildTableActions(vm, [
                    { title, click: () => showMessage({ content: row.ADS_DISPOSE_DESCR, title: '处理结果', force: true }) }
                  ])
                } else if (cellValue === '04') {
                  return buildTableActions(vm, [
                    { title, click: () => showMessage({ content: row.ADS_RESULT, title: '校验结果', force: true }) }
                  ])
                } else {
                  return title
                }
              }
            }
          },
          {
            props: { label: '扣除额度', prop: 'ADS_AMOUNT', width: '100' }
          },
          {
            props: { label: '本年度累计已扣', prop: 'ADS_AT_ALREADY', width: '125' }
          },
          {
            props: { label: '本年度累计应扣', prop: 'ADS_AT_SHOULD', width: '125' }
          },
          {
            props: {
              label: '描述', prop: 'ADS_DESCR', width: '750', 'show-overflow-tooltip': true,
              formatter: function(row, column, cellValue, index) {
                const h = vm.$createElement
                return h('span', {}, cellValue)
              }
            }
          },
          {
            props: { prop: 'fill' }
          }
        ]
      }
    },
    paginationMethod: function(vm, scopeMeta) {
      return adSnapshootList
    }
  }
}
const SM_FRL2t = () => {
  return {
    dialogTitle: function(vm, scopeMeta) {
      return '流转记录'
    },
    searcher: function(vm, scopeMeta) {
      return {
        items: [
          {
            props: { label: '校验状态', prop: 'VR_STATUS' },
            items: [
              { tag: 'el-select', name: 'VR_STATUS', items: buildFormItemsByDicts('V4Y_R4T_VR_STATUS', 'el-option') }
            ]
          }
        ]
      }
    },
    table: function(vm, scopeMeta) {
      return {
        items: [
          {
            props: { label: '操作人', prop: 'FR_OPERATOR_NAME', fixed: 'left', width: '125' }
          },
          {
            props: { label: '操作时间', prop: 'FR_OPERATE_TIME', fixed: 'left', align: 'center', width: '150' }
          },
          {
            props: { label: '操作', prop: 'FR_OPERATE_TITLE', fixed: 'left', width: '125' }
          },
          {
            props: { label: '操作前状态', prop: 'FR_OPERATE_SB_TITLE', fixed: 'left', width: '125' }
          },
          {
            props: { label: '操作后状态', prop: 'FR_OPERATE_SA_TITLE', fixed: 'left', width: '125' }
          },
          {
            props: {
              label: '操作描述', prop: 'FR_OPERATE_DESCR', width: '500', 'show-overflow-tooltip': true,
              formatter: function(row, column, cellValue, index) {
                const h = vm.$createElement
                return h('span', {}, cellValue)
              }
            }
          },
          {
            props: {
              label: '备注', prop: 'FR_REMARK', width: '250', 'show-overflow-tooltip': true,
              formatter: function(row, column, cellValue, index) {
                const h = vm.$createElement
                return h('span', {}, cellValue)
              }
            }
          },
          {
            props: { prop: 'fill' }
          }
        ]
      }
    },
    paginationMethod: function(vm, scopeMeta) {
      return flowRecordList
    }
  }
}
const SM_PL2t = () => {
  return {
    components: function(vm, scopeMeta) {
      const { routerName } = scopeMeta
      const components = [
        {
          name: 'PayrollView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
          props: { scope: 'PayrollView' }
        },
        {
          name: 'FlowRecordList', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'FlowRecordList' }
        }
      ]
      if (routerName === 'PIT-PayrollFeedback') {
        components.push({
          name: 'PayrollExport', component: () => import(`@/components/Typography/Flow/DialogForm`),
          props: { scope: 'PayrollExport' }
        })
      }
      return components
    },
    flowActions: function(vm, scopeMeta) {
      const { routerName } = scopeMeta
      const flowActions = []
      if (routerName === 'PIT-PayrollConfirm') {
        flowActions.push({
          code: '04', title: '质疑', icon: 'el-icon-antd-unlike', type: 'danger', 'status-to': { P_STATUS: '04' }, remark: true,
          click: function(data, flowRecord, allin) {
            updatePayrollById(vm, data, flowRecord)
          }
        })
      } else if (routerName === 'PIT-PayrollDoubt') {
        flowActions.push({
          code: '06', title: '不调整', icon: 'el-icon-antd-stop', type: 'success', 'status-to': { P_STATUS: '06' }, remark: true,
          click: function(data, flowRecord, allin) {
            updatePayrollById(vm, data, flowRecord)
          }
        })
        flowActions.push({
          code: '05', title: '调整', icon: 'el-icon-antd-control', type: 'danger', 'status-to': { P_STATUS: '05' }, remark: true,
          click: function(data, flowRecord, allin) {
            updatePayrollById(vm, data, flowRecord)
          }
        })
      } else if (routerName === 'PIT-PayrollSubmit') {
        flowActions.push({
          code: '01', title: '提交', icon: 'el-icon-antd-verticalleft', type: 'success', 'all-in': true, 'status-to': { P_STATUS: '08' },
          click: function(data, flowRecord, allin) {
            if (allin === true) {
              updatePayrollByQuery(vm, data, flowRecord)
            } else {
              updatePayrollById(vm, data, flowRecord)
            }
          }
        })
        flowActions.push({
          code: '02', title: '打回', icon: 'el-icon-antd-verticalright', type: 'danger', 'status-to': { P_STATUS: '03' }, remark: true,
          click: function(data, flowRecord, allin) {
            updatePayrollById(vm, data, flowRecord)
          }
        })
      } else if (routerName === 'PIT-PayrollFeedback') {
        flowActions.push({
          code: '07', title: '已发放', icon: 'el-icon-antd-carryout', type: 'success', 'all-in': true, 'status-to': { P_STATUS: '09' },
          click: function(data, flowRecord, allin) {
            if (allin === true) {
              updatePayrollByQuery(vm, data, flowRecord)
            } else {
              updatePayrollById(vm, data, flowRecord)
            }
          }
        })
      }
      return flowActions
    },
    controller: function(vm, scopeMeta) {
      const { routerName } = scopeMeta
      const items = []
      if (routerName === 'PIT-PayrollFeedback') {
        items.push({
          text: '导出发放单', props: { icon: 'el-icon-antd-export' },
          events: {
            click: function() {
              vm.ref('PayrollExport').showDialog()
            }
          }
        })
      }
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return pkit.getSearcher(vm, scopeMeta)
    },
    table: function(vm, scopeMeta) {
      return pkit.getTable(vm, scopeMeta)
    },
    paginationMethod: function(vm, scopeMeta) {
      return payrollList
    }
  }
}
const SM_PV2w = () => {
  return {
    components: function(vm, scopeMeta) {
      return [
        {
          name: 'SalarySnapshootView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
          props: { scope: 'SalarySnapshootView' }
        },
        {
          name: 'ADSnapshootListView', component: () => import(`@/components/Typography/Flow/DialogList`),
          props: { scope: 'ADSnapshootListView' }
        }
      ]
    },
    dialogTitle: function(vm, scopeMeta) {
      return '工资单'
    },
    controller: function(vm, scopeMeta) {
      const items = []
      items.push({
        float: 'right', text: '薪资明细', props: { icon: 'el-icon-antd-Dollar' },
        events: {
          click: () => {
            const { P_FREQ, P_ISSUE, P_STAFF_NUMBER, P_TYPE } = vm.getModel()
            const pk = { SS_FREQ: P_FREQ, SS_ISSUE: P_ISSUE, SS_STAFF_NUMBER: P_STAFF_NUMBER, SS_TYPE: P_TYPE }
            vm.ref('SalarySnapshootView').showDialog(pk)
          }
        }
      })
      items.push({
        float: 'right', text: '附加扣除', props: { icon: 'el-icon-antd-piechart' },
        events: {
          click: () => {
            const { P_FREQ, P_ISSUE, P_STAFF_NUMBER } = vm.getModel()
            const pk = { ADS_FREQ: P_FREQ, ADS_ISSUE: P_ISSUE, ADS_STAFF_NUMBER: P_STAFF_NUMBER }
            vm.ref('ADSnapshootListView').showDialog(pk)
          }
        }
      })
      return { items }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return pkit.getFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return payrollSingle
    }
  }
}
const SM_PE4t = () => {
  return {
    dialogTitle: function(vm, scopeMeta) {
      return '导出发放单'
    },
    controller: function(vm, scopeMeta) {
      return {
        showReset: false,
        items: [
          {
            float: 'right', text: '导  出', props: { icon: 'el-icon-antd-export', type: 'primary' },
            events: {
              click: () => {
                vm.ref().validateForm().then(valid => {
                  if (valid) {
                    const model = vm.ref().getModel()
                    alert(model.P_ISSUE)
                    vm.hideDialog()
                  }
                })
              }
            }
          }
        ]
      }
    },
    defaultModel: function(vm, scopeMeta) {
      return {
        P_ISSUE: moment().subtract(1, 'months').format('YYYY-MM')
      }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return [
          {
            props: {
              label: '期次号', prop: 'P_ISSUE',
              rules: [
                { required: true, message: '请选择期次号', trigger: 'blur' }
              ]
            },
            items: [
              {
                tag: 'el-date-picker', name: 'P_ISSUE', props: { type: 'month' }
              }
            ]
          }
        ]
      }
    }
  }
}
const M_P5l = (routerName) => {
  const meta = {
    [routerName]: SM_PL2t(),
    'PayrollView': SM_PV2w(),
    'SalarySnapshootView': SM_SSV2w(),
    'ADSnapshootListView': SM_ADSL2t('view'),
    'FlowRecordList': SM_FRL2t()
  }
  if (routerName === 'PIT-PayrollFeedback') {
    meta['PayrollExport'] = SM_PE4t()
  }
  return meta
}

let enterpriseOptions = []
export default parallel([
  enterpriseList({})
]).then((responses) => {
  enterpriseOptions = responses[0].data.items
}).then(() => {
  return [
    {
      id: 'flow_pit_core',
      title: '个税薪资核算流程',
      descr: '个税薪资核算流程',
      pages: [
        {
          routerName: 'PIT-SalaryGather',
          title: '薪酬信息采集',
          descr: '薪酬信息采集',
          'status-from': { SS_STATUS: ['01', '02', '03'] },
          meta: {
            'PIT-SalaryGather': SM_SSL2t(),
            'SalarySnapshootEdit': SM_SSE2t(),
            'SalarySnapshootImport': SM_SSI4t(),
            'VerifyResultListEdit': SM_VRL2t('edit'),
            'ADSnapshootListEdit': SM_ADSL2t('edit'),
            'FlowRecordList': SM_FRL2t()
          }
        },
        {
          routerName: 'PIT-SalaryConfirm',
          title: '薪酬信息确认',
          descr: '薪酬信息确认',
          'status-from': { SS_STATUS: ['04', '05'] },
          meta: {
            'PIT-SalaryConfirm': SM_SSL2t(),
            'SalarySnapshootView': SM_SSV2w(),
            'VerifyResultListView': SM_VRL2t('view'),
            'ADSnapshootListView': SM_ADSL2t('view'),
            'FlowRecordList': SM_FRL2t()
          }
        },
        {
          routerName: 'PIT-PayrollConfirm',
          title: '确认工资单',
          descr: '确认工资单',
          'status-from': { P_STATUS: ['01', '02', '03', '04', '05'] },
          meta: M_P5l('PIT-PayrollConfirm')
        },
        {
          routerName: 'PIT-PayrollDoubt',
          title: '工资单质疑处理',
          descr: '工资单质疑处理',
          'status-from': { P_STATUS: ['04'] },
          meta: M_P5l('PIT-PayrollDoubt')
        },
        {
          routerName: 'PIT-PayrollSubmit',
          title: '提交工资单',
          descr: '提交工资单',
          'status-from': { P_STATUS: ['06', '07'] },
          meta: M_P5l('PIT-PayrollSubmit')
        },
        {
          routerName: 'PIT-PayrollFeedback',
          title: '工资单发放反馈',
          descr: '工资单发放反馈',
          'status-from': { P_STATUS: ['08', '09'] },
          meta: M_P5l('PIT-PayrollFeedback')
        }
      ]
    }
  ]
})
