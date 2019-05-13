import flow from '@/flow'
import math from 'mathjs'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { showMessage } from '@/utils/element'
import { buildTableActions, buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'
import { staffList, salarySingle } from '@/api/pit'

function loadStaffs(queryString, callback) {
  if (isNotEmpty(queryString)) {
    staffList({ S_NAME: queryString }).then(response => {
      const results = response.data.items
      callback(results)
    })
  }
}

function loadSalary(vm, model) {
  vm.loading = true
  const SS_STAFF_NUMBER = model.SS_STAFF_NUMBER
  const SS_TYPE = model.SS_TYPE
  salarySingle({ S_STAFF_NUMBER: SS_STAFF_NUMBER, S_TYPE: SS_TYPE }).then(response => {
    const salary = response.data
    if (isNotEmpty(salary)) {
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
      vm.handleDialogInput(snapshoot)
    } else {
      showMessage({ content: '未找到指定员工薪资信息', type: 'warning' })
    }
    vm.loading = false
  })
}

export function getPrimaryKey(salarySnapshoot) {
  return {
    SS_FREQ: salarySnapshoot.SS_FREQ,
    SS_ISSUE: salarySnapshoot.SS_ISSUE,
    SS_STAFF_NUMBER: salarySnapshoot.SS_STAFF_NUMBER,
    SS_TYPE: salarySnapshoot.SS_TYPE
  }
}

export function getSearcher(vm, scopeMeta, data) {
  const { getDicts } = vm.$store.getters
  const routerName = scopeMeta.routerName
  const page = flow.getPage(routerName)
  const from = page['status-from']
  const statuses = []
  from.forEach(status => {
    statuses.push(status.SS_STATUS)
  })
  const { enterpriseOptions } = data
  const items = []
  if (isNotEmpty(enterpriseOptions)) {
    items.push({
      props: { label: '期次号', prop: 'SS_ISSUE' },
      items: [
        {
          tag: 'el-date-picker', name: 'SS_ISSUE', props: { type: 'month' }
        }
      ]
    })
    items.push({
      props: { label: '员工号', prop: 'SS_STAFF_NUMBER' },
      items: [
        { tag: 'el-input', name: 'SS_STAFF_NUMBER' }
      ]
    })
    items.push({
      props: { label: '姓名', prop: 'SS_STAFF_NAME' },
      items: [
        { tag: 'el-input', name: 'SS_STAFF_NAME' }
      ]
    })
    items.push({
      props: { label: '薪金类型', prop: 'SS_TYPE' },
      items: buildFormItemsByDicts('S4Y_S7T_SS_TYPE', 'el-radio', 'SS_TYPE')
    })
    items.push({
      props: { label: '发放模式', prop: 'SS_PAY_TYPE' },
      items: buildFormItemsByDicts('S4Y_S7T_SS_PAY_TYPE', 'el-radio', 'SS_PAY_TYPE')
    })
    items.push({
      props: { label: '发放主体', prop: 'SS_PAY_ENTERPRISE_ID' },
      items: [
        { tag: 'el-select', name: 'SS_PAY_ENTERPRISE_ID', items: buildFormItems(enterpriseOptions, 'E_ID', 'E_NAME', 'el-option') }
      ]
    })
    let statusItems = []
    if (isEmpty(statuses)) {
      statusItems = buildFormItemsByDicts('S4Y_S7T_SS_STATUS', 'el-option')
    } else {
      let statusOptions = getDicts('S4Y_S7T_SS_STATUS')
      statusOptions = statusOptions.filter(statusOption => {
        if (statuses.includes(statusOption.value)) {
          return true
        }
        return false
      })
      statusItems = buildFormItems(statusOptions, 'value', 'title', 'el-option')
    }
    items.push({
      props: { label: '状态', prop: 'SS_STATUS' },
      items: [
        { tag: 'el-select', name: 'SS_STATUS', items: statusItems }
      ]
    })
    items.push({
      props: { label: '校验状态', prop: 'SS_VERIFY_STATUS' },
      items: [
        { tag: 'el-select', name: 'SS_VERIFY_STATUS', items: buildFormItemsByDicts('S4Y_S7T_SS_VERIFY_STATUS', 'el-option') }
      ]
    })
  }
  return {
    extraParams: { SS_STATUS: statuses },
    items
  }
}

export function getTable(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const scope = scopeMeta.scope
  const items = []
  items.push({
    props: { label: '员工号', prop: 'SS_STAFF_NUMBER', fixed: 'left', width: '150' }
  })
  items.push({
    props: { label: '姓名', prop: 'SS_STAFF_NAME', fixed: 'left', width: '125' }
  })
  items.push({
    props: { label: '期次号', prop: 'SS_ISSUE', fixed: 'left', align: 'center', width: '100' }
  })
  items.push({
    props: {
      label: '薪金类型', prop: 'SS_TYPE', align: 'center', width: '100',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('S4Y_S7T_SS_TYPE', cellValue)
      }
    }
  })
  items.push({
    props: {
      label: '发放模式', prop: 'SS_PAY_TYPE', align: 'center', width: '100',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('S4Y_S7T_SS_PAY_TYPE', cellValue)
      }
    }
  })
  items.push({
    props: { label: '发放主体', prop: 'SS_PAY_ENTERPRISE_NAME', width: '175' }
  })
  items.push({
    props: {
      label: '状态', prop: 'SS_STATUS', width: '125',
      formatter: function(row, column, cellValue, index) {
        const title = getDictTitle('S4Y_S7T_SS_STATUS', cellValue)
        const pk = getPrimaryKey(row)
        const primaryKey = { FR_BODY_TYPE: '01', FR_BODY_ID: JSON.stringify(pk) }
        return buildTableActions(vm, [
          { title, icon: 'el-icon-antd-audit', click: () => vm.ref('FlowRecordList').showDialog(primaryKey) }
        ])
      }
    }
  })
  items.push({
    props: {
      label: '校验状态', prop: 'SS_VERIFY_STATUS', align: 'center', width: '100',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('S4Y_S7T_SS_VERIFY_STATUS', cellValue)
      }
    }
  })
  items.push({
    props: { prop: 'fill' }
  })
  items.push({
    props: {
      label: '操作', prop: 'action', fixed: 'right', width: '200',
      formatter: function(row, column, cellValue, index) {
        const pk = getPrimaryKey(row)
        const SS_TYPE = row.SS_TYPE
        const SS_VERIFY_STATUS = row.SS_VERIFY_STATUS
        const actions = []
        let operate = 'View'
        let operateTitle = '查看'
        if (scope === 'PIT-SalaryGather') {
          operate = 'Edit'
          operateTitle = '编辑'
        }
        actions.push({ title: operateTitle, click: () => vm.ref(`SalarySnapshoot${operate}`).showDialog(pk) })
        if (SS_VERIFY_STATUS === '03' || SS_VERIFY_STATUS === '04') {
          const primaryKey = { VR_BODY_TYPE: '01', VR_BODY_ID: JSON.stringify(pk) }
          actions.push({ title: '校验结果', click: () => vm.ref(`VerifyResultList${operate}`).showDialog(primaryKey) })
        }
        if (SS_TYPE === '01') {
          const primaryKey = { ADS_FREQ: pk.SS_FREQ, ADS_ISSUE: pk.SS_ISSUE, ADS_STAFF_NUMBER: pk.SS_STAFF_NUMBER }
          actions.push({ title: '附加扣除', click: () => vm.ref(`ADSnapshootList${operate}`).showDialog(primaryKey) })
        }
        return buildTableActions(vm, actions)
      }
    }
  })
  return { items }
}

function buildSSWageItem(name, label, disabled) {
  return {
    props: {
      label, prop: name,
      rules: [
        { required: true, message: `请输入${label}`, trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input-number', name, props: { disabled }
      }
    ]
  }
}
function buildSS5I1FItem(type, name, label, disabled) {
  // type: F 基数 | R 比例 | P 缴纳
  if (type === 'F') {
    return {
      props: { label, prop: name },
      items: [
        {
          tag: 'el-input', name, props: { disabled }
        }
      ]
    }
  } else if (type === 'R') {
    return {
      props: { label, prop: name },
      items: [
        {
          tag: 'el-input', name, props: { disabled },
          items: [
            {
              tag: 'i', props: { slot: 'append', class: 'el-icon-antd-percentage' }
            }
          ]
        }
      ]
    }
  } else if (type === 'P') {
    return {
      props: {
        label, prop: name,
        rules: [
          { required: true, message: `请输入${label}`, trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-input-number', name, props: { disabled }
        }
      ]
    }
  }
}
export function getFormItems(vm, scopeMeta, operate, model, data) {
  // operate add | edit | view
  const { getDistricts } = vm.$store.getters
  const items = []
  const { enterpriseOptions } = data
  if (isNotEmpty(enterpriseOptions)) {
    let readonlyPK = false
    let readonly = false
    if (operate === 'edit') {
      readonlyPK = true
    } else if (operate === 'view') {
      readonlyPK = true
      readonly = true
    }
    items.push({
      props: { label: '频度', prop: 'SS_FREQ' },
      items: buildFormItemsByDicts('S4Y_S7T_SS_FREQ', 'el-radio', 'SS_FREQ', {
        props: { disabled: readonlyPK }
      })
    })
    items.push({
      props: {
        label: '期次号', prop: 'SS_ISSUE',
        rules: [
          { required: true, message: '请选择期次号', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-date-picker', name: 'SS_ISSUE', props: { type: 'month', disabled: readonlyPK }
        }
      ]
    })
    items.push({
      props: { label: '薪金类型', prop: 'SS_TYPE' },
      items: buildFormItemsByDicts('S4Y_S7T_SS_TYPE', 'el-radio', 'SS_TYPE', {
        props: { disabled: readonlyPK }
      })
    })
    const loadSalarySlots = []
    if (!readonlyPK) {
      loadSalarySlots.push({
        slot: 'append',
        COM: {
          tag: 'el-button',
          props: { icon: 'el-icon-antd-download' },
          events: {
            click: function() {
              loadSalary(vm, model)
            }
          }
        }
      })
    }
    items.push({
      props: {
        label: '员工号', prop: 'SS_STAFF_NUMBER',
        rules: [
          { required: true, message: '请输入员工号', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-autocomplete-wrap', name: 'SS_STAFF_NUMBER', linkage: true,
          props: {
            placeholder: '请输入员工号 / 姓名 ...', 'value-key': 'S_NUMBER', 'trigger-on-focus': false,
            'fetch-suggestions': function(queryString, callback) {
              loadStaffs(queryString, callback)
            },
            slots: loadSalarySlots,
            template: [
              { tag: 'div', style: '', prop: 'S_NAME' },
              { tag: 'div', style: 'line-height: 18px; font-size: 12px; color: #b4b4b4; padding-left: 14px', prop: 'S_NUMBER' }
            ],
            disabled: readonlyPK
          }
        }
      ]
    })
    const SS_SALARY_LOADED = model.SS_SALARY_LOADED
    const SS_FREQ = model.SS_FREQ
    const SS_ISSUE = model.SS_ISSUE
    const SS_STAFF_NUMBER = model.SS_STAFF_NUMBER
    const SS_TYPE = model.SS_TYPE
    if (
      (operate === 'add' && !SS_SALARY_LOADED) ||
      isEmpty(SS_FREQ) ||
      isEmpty(SS_ISSUE) ||
      isEmpty(SS_STAFF_NUMBER) ||
      isEmpty(SS_TYPE)
    ) {
      return items
    }
    items.push({ tag: 'el-new-row', title: '发放信息' })
    items.push({
      props: { label: '发放地', prop: 'SS_PAY_SITE' },
      items: [
        {
          tag: 'el-cascader', name: 'SS_PAY_SITE', props: { options: getDistricts, disabled: true }
        }
      ]
    })
    items.push({
      props: { label: '发放模式', prop: 'SS_PAY_TYPE' },
      items: buildFormItemsByDicts('S4Y_S7T_SS_PAY_TYPE', 'el-radio', 'SS_PAY_TYPE', {
        props: { disabled: true }
      })
    })
    items.push({
      props: {
        label: '发放主体', prop: 'SS_PAY_ENTERPRISE_ID',
        rules: [
          { required: true, message: '请输入发放主体', trigger: 'blur' }
        ]
      },
      items: [
        { tag: 'el-select', name: 'SS_PAY_ENTERPRISE_ID', props: { disabled: true }, items: buildFormItems(enterpriseOptions, 'E_ID', 'E_NAME', 'el-option') }
      ]
    })
    items.push({
      props: {
        label: '预计发放日期', prop: 'SS_PREDICT_PAY_DATE',
        rules: [
          { required: true, message: '请选择预计发放日期', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-date-picker', name: 'SS_PREDICT_PAY_DATE', props: { disabled: readonly }
        }
      ]
    })
    items.push({ tag: 'el-new-group', title: '薪资组成' })
    items.push(buildSSWageItem('SS_WAGE_BASIC', '基本工资', readonly))
    items.push(buildSSWageItem('SS_WAGE_POST', '岗位工资', readonly))
    items.push(buildSSWageItem('SS_WAGE_KPI', '绩效工资', readonly))
    items.push(buildSSWageItem('SS_WAGE_OVERTIME', '加班工资', readonly))
    items.push(buildSSWageItem('SS_WAGE_RETROACTIVE', '补发工资', readonly))
    items.push(buildSSWageItem('SS_WAGE_PROBATION', '试用期工资', readonly))
    items.push(buildSSWageItem('SS_SUBSIDY', '补贴', readonly))
    items.push(buildSSWageItem('SS_BONUS', '奖金', readonly))
    items.push(buildSSWageItem('SS_DEDUCT', '扣款', readonly))
    items.push(buildSSWageItem('SS_WAGE_TOTAL', '待发工资', readonly))
    items.push({ tag: 'el-new-group', title: '五险一金' })
    items.push({ tag: 'el-new-row', title: '养老' })
    items.push(buildSS5I1FItem('F', 'SS_FIDUCIAL_PENSION', '养老缴纳基数', true))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PENSION_P', '养老个人缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PENSION_P', '养老个人缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PENSION_E', '养老企业缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PENSION_E', '养老企业缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PENSION_PS', '养老个人补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PENSION_PS', '养老个人补充缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PENSION_ES', '养老企业补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PENSION_ES', '养老企业补充缴纳', readonly))
    items.push({ tag: 'el-new-row', title: '医疗' })
    items.push(buildSS5I1FItem('F', 'SS_FIDUCIAL_MEDICAL', '医疗缴纳基数', true))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_MEDICAL_P', '医疗个人缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_MEDICAL_P', '医疗个人缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_MEDICAL_E', '医疗企业缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_MEDICAL_E', '医疗企业缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_MEDICAL_PS', '医疗个人补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_MEDICAL_PS', '医疗个人补充缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_MEDICAL_ES', '医疗企业补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_MEDICAL_ES', '医疗企业补充缴纳', readonly))
    items.push({ tag: 'el-new-row', title: '失业' })
    items.push(buildSS5I1FItem('F', 'SS_FIDUCIAL_UNEMPLOYMENT', '失业缴纳基数', true))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_UNEMPLOYMENT_P', '失业个人缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_UNEMPLOYMENT_P', '失业个人缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_UNEMPLOYMENT_E', '失业企业缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_UNEMPLOYMENT_E', '失业企业缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_UNEMPLOYMENT_PS', '失业个人补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_UNEMPLOYMENT_PS', '失业个人补充缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_UNEMPLOYMENT_ES', '失业企业补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_UNEMPLOYMENT_ES', '失业企业补充缴纳', readonly))
    items.push({ tag: 'el-new-row', title: '生育' })
    items.push(buildSS5I1FItem('F', 'SS_FIDUCIAL_PROCREATION', '生育缴纳基数', true))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PROCREATION_P', '生育个人缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PROCREATION_P', '生育个人缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PROCREATION_E', '生育企业缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PROCREATION_E', '生育企业缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PROCREATION_PS', '生育个人补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PROCREATION_PS', '生育个人补充缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_PROCREATION_ES', '生育企业补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_PROCREATION_ES', '生育企业补充缴纳', readonly))
    items.push({ tag: 'el-new-row', title: '工伤' })
    items.push(buildSS5I1FItem('F', 'SS_FIDUCIAL_INJURY', '工伤缴纳基数', true))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_INJURY_P', '工伤个人缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_INJURY_P', '工伤个人缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_INJURY_E', '工伤企业缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_INJURY_E', '工伤企业缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_INJURY_PS', '工伤个人补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_INJURY_PS', '工伤个人补充缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_INJURY_ES', '工伤企业补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_INJURY_ES', '工伤企业补充缴纳', readonly))
    items.push({ tag: 'el-new-row', title: '公积金' })
    items.push(buildSS5I1FItem('F', 'SS_FIDUCIAL_CR_FUND', '公积金缴纳基数', true))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_CR_FUND_P', '公积金个人缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_CR_FUND_P', '公积金个人缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_CR_FUND_E', '公积金企业缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_CR_FUND_E', '公积金企业缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('F', 'SS_FIDUCIAL_CR_FUND_S', '公积金补充缴纳基数', true))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_CR_FUND_PS', '公积金个人补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_CR_FUND_PS', '公积金个人补充缴纳', readonly))
    items.push({ tag: 'el-new-row' })
    items.push(buildSS5I1FItem('R', 'SS_RATIO_CR_FUND_ES', '公积金企业补充缴纳比例', true))
    items.push(buildSS5I1FItem('P', 'SS_PAY_CR_FUND_ES', '公积金企业补充缴纳', readonly))
  }
  return items
}
