import flow from '@/flow'
import { isEmpty } from '@/utils/validate'
import { buildTableActions, buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'

export function getPrimaryKey(payroll) {
  return {
    P_FREQ: payroll.P_FREQ,
    P_ISSUE: payroll.P_ISSUE,
    P_STAFF_NUMBER: payroll.P_STAFF_NUMBER,
    P_TYPE: payroll.P_TYPE
  }
}

export function getSearcher(vm, scopeMeta) {
  const { getDicts } = vm.$store.getters
  const routerName = scopeMeta.routerName
  const page = flow.getPage(routerName)
  const statuses = page['status-from'].P_STATUS
  const items = []
  items.push({
    props: { label: '期次号', prop: 'P_ISSUE' },
    items: [
      {
        tag: 'el-date-picker', name: 'P_ISSUE', props: { type: 'month' }
      }
    ]
  })
  items.push({
    props: { label: '员工号', prop: 'P_STAFF_NUMBER' },
    items: [
      { tag: 'el-input', name: 'P_STAFF_NUMBER' }
    ]
  })
  items.push({
    props: { label: '姓名', prop: 'P_STAFF_NAME' },
    items: [
      { tag: 'el-input', name: 'P_STAFF_NAME' }
    ]
  })
  let statusItems = []
  if (isEmpty(statuses)) {
    statusItems = buildFormItemsByDicts('P5L_P_STATUS', 'el-option')
  } else {
    let statusOptions = getDicts('P5L_P_STATUS')
    statusOptions = statusOptions.filter(statusOption => {
      if (statuses.includes(statusOption.value)) {
        return true
      }
      return false
    })
    statusItems = buildFormItems(statusOptions, 'value', 'title', 'el-option')
  }
  items.push({
    props: { label: '状态', prop: 'P_STATUS' },
    items: [
      { tag: 'el-select', name: 'P_STATUS', items: statusItems }
    ]
  })
  return {
    extraParams: { P_STATUS: statuses },
    items
  }
}

export function getTable(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const items = []
  items.push({
    props: { label: '员工号', prop: 'P_STAFF_NUMBER', fixed: 'left', width: '150' }
  })
  items.push({
    props: { label: '姓名', prop: 'P_STAFF_NAME', fixed: 'left', width: '125' }
  })
  items.push({
    props: { label: '期次号', prop: 'P_ISSUE', fixed: 'left', align: 'center', width: '100' }
  })
  items.push({
    props: { label: '预计发放日期', prop: 'P_PREDICT_PAY_DATE', align: 'center', width: '125' }
  })
  items.push({
    props: { label: '实际发放日期', prop: 'P_ACTUAL_PAY_DATE', align: 'center', width: '125' }
  })
  items.push({
    props: { label: '待发工资', prop: 'P_WAGE_TOTAL', width: '100' }
  })
  items.push({
    props: { label: '实发工资', prop: 'P_WAGE_ACTUAL', width: '100' }
  })
  items.push({
    props: {
      label: '状态', prop: 'P_STATUS', width: '125',
      formatter: function(row, column, cellValue, index) {
        const title = getDictTitle('P5L_P_STATUS', cellValue)
        const pk = getPrimaryKey(row)
        const primaryKey = { FR_BODY_TYPE: '02', FR_BODY_ID: JSON.stringify(pk) }
        return buildTableActions(vm, [
          { title, icon: 'el-icon-antd-audit', click: () => vm.ref('FlowRecordList').showDialog(primaryKey) }
        ])
      }
    }
  })
  items.push({
    props: { prop: 'fill' }
  })
  items.push({
    props: {
      label: '操作', prop: 'action', fixed: 'right', align: 'center', width: '100',
      formatter: function(row, column, cellValue, index) {
        const pk = getPrimaryKey(row)
        return buildTableActions(vm, [
          { title: '查看', click: () => vm.ref('PayrollView').showDialog(pk) }
        ])
      }
    }
  })
  return { items }
}

export function getFormItems(vm, scopeMeta, operate, model) {
  // operate view
  const items = []
  const readonlyPK = true
  const readonly = true
  items.push({
    props: { label: '频度', prop: 'P_FREQ' },
    items: buildFormItemsByDicts('P5L_P_FREQ', 'el-radio', 'P_FREQ', {
      props: { disabled: readonlyPK }
    })
  })
  items.push({
    props: { label: '期次号', prop: 'P_ISSUE' },
    items: [
      {
        tag: 'el-date-picker', name: 'P_ISSUE', props: { type: 'month', disabled: readonlyPK }
      }
    ]
  })
  items.push({
    props: { label: '员工号', prop: 'P_STAFF_NUMBER' },
    items: [
      {
        tag: 'el-input', name: 'P_STAFF_NUMBER', props: { disabled: readonlyPK }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '预计发放日期', prop: 'P_PREDICT_PAY_DATE' },
    items: [
      {
        tag: 'el-date-picker', name: 'P_PREDICT_PAY_DATE', props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '实际发放日期', prop: 'P_ACTUAL_PAY_DATE' },
    items: [
      {
        tag: 'el-date-picker', name: 'P_ACTUAL_PAY_DATE', props: { disabled: readonly }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '待发工资', prop: 'P_WAGE_TOTAL' },
    items: [
      {
        tag: 'el-input-number', name: 'P_WAGE_TOTAL', props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '附加扣除总额', prop: 'P_A8L_D4T_TOTAL' },
    items: [
      {
        tag: 'el-input-number', name: 'P_A8L_D4T_TOTAL', props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '应税工资', prop: 'P_WAGE_TAX' },
    items: [
      {
        tag: 'el-input-number', name: 'P_WAGE_TAX', props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '个税缴纳总额', prop: 'P_PIT_TOTAL' },
    items: [
      {
        tag: 'el-input-number', name: 'P_PIT_TOTAL', props: { disabled: readonly }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '五险一金个人缴纳总额', prop: 'P_5I1F_P_TOTAL' },
    items: [
      {
        tag: 'el-input-number', name: 'P_5I1F_P_TOTAL', props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '五险一金企业缴纳总额', prop: 'P_5I1F_E_TOTAL' },
    items: [
      {
        tag: 'el-input-number', name: 'P_5I1F_E_TOTAL', props: { disabled: readonly }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '实发工资', prop: 'P_WAGE_ACTUAL' },
    items: [
      {
        tag: 'el-input-number', name: 'P_WAGE_ACTUAL', props: { disabled: readonly }
      }
    ]
  })
  return items
}
