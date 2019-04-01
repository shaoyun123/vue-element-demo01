import store from '@/store'
import * as validator from '@/utils/validate'
import { buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'

export function buildFlowRecord(
  FR_BODY_TYPE,
  FR_OPERATE_CODE,
  FR_OPERATE_TITLE,
  FR_OPERATE_DESCR,
  FR_OPERATE_SB_CODE,
  FR_OPERATE_SB_TITLE,
  FR_OPERATE_SA_CODE,
  FR_OPERATE_SA_TITLE
) {
  const flowRecord = {}
  if (validator.isNotEmpty(FR_BODY_TYPE)) {
    flowRecord.FR_BODY_TYPE = FR_BODY_TYPE
  }
  if (validator.isNotEmpty(FR_OPERATE_CODE)) {
    flowRecord.FR_OPERATE_CODE = FR_OPERATE_CODE
  }
  if (validator.isNotEmpty(FR_OPERATE_TITLE)) {
    flowRecord.FR_OPERATE_TITLE = FR_OPERATE_TITLE
  }
  if (validator.isNotEmpty(FR_OPERATE_DESCR)) {
    flowRecord.FR_OPERATE_DESCR = FR_OPERATE_DESCR
  }
  if (validator.isNotEmpty(FR_OPERATE_SB_CODE)) {
    flowRecord.FR_OPERATE_SB_CODE = FR_OPERATE_SB_CODE
  }
  if (validator.isNotEmpty(FR_OPERATE_SB_TITLE)) {
    flowRecord.FR_OPERATE_SB_TITLE = FR_OPERATE_SB_TITLE
  }
  if (validator.isNotEmpty(FR_OPERATE_SA_CODE)) {
    flowRecord.FR_OPERATE_SA_CODE = FR_OPERATE_SA_CODE
  }
  if (validator.isNotEmpty(FR_OPERATE_SA_TITLE)) {
    flowRecord.FR_OPERATE_SA_TITLE = FR_OPERATE_SA_TITLE
  }
  return flowRecord
}

export function buildFlowRecordSimple(FR_BODY_TYPE, FR_OPERATE_CODE, FR_OPERATE_DESCR, FR_OPERATE_SB_CODE, FR_OPERATE_SA_CODE) {
  let dictType = ''
  if (FR_BODY_TYPE === '01') {
    dictType = 'S4Y_S7T_SS_STATUS'
  } else if (FR_BODY_TYPE === '02') {
    dictType = 'P5L_P_STATUS'
  }
  const getters = store.getters
  const FR_OPERATE_TITLE = getters.getDictTitle('OPERATE_CODE', FR_OPERATE_CODE)
  const FR_OPERATE_SB_TITLE = getters.getDictTitle(dictType, FR_OPERATE_SB_CODE)
  const FR_OPERATE_SA_TITLE = getters.getDictTitle(dictType, FR_OPERATE_SA_CODE)
  return buildFlowRecord(
    FR_BODY_TYPE,
    FR_OPERATE_CODE,
    FR_OPERATE_TITLE,
    FR_OPERATE_DESCR,
    FR_OPERATE_SB_CODE,
    FR_OPERATE_SB_TITLE,
    FR_OPERATE_SA_CODE,
    FR_OPERATE_SA_TITLE
  )
}

export function getSalarySnapshootId(salarySnapshoot) {
  return {
    SS_FREQ: salarySnapshoot.SS_FREQ,
    SS_ISSUE: salarySnapshoot.SS_ISSUE,
    SS_STAFF_NUMBER: salarySnapshoot.SS_STAFF_NUMBER,
    SS_TYPE: salarySnapshoot.SS_TYPE
  }
}

export function getSalarySnapshootSearcher(enterpriseOptions, statusFilter) {
  const items = []
  if (validator.isNotEmpty(enterpriseOptions)) {
    const getters = store.getters
    items.push({
      props: { label: '期次号', prop: 'SS_ISSUE' },
      items: [
        {
          tag: 'el-date-picker',
          name: 'SS_ISSUE',
          props: { type: 'month' }
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
        {
          tag: 'el-select',
          name: 'SS_PAY_ENTERPRISE_ID',
          items: buildFormItems(enterpriseOptions, 'E_ID', 'E_NAME', 'el-option')
        }
      ]
    })
    let statusItems = []
    if (validator.isEmpty(statusFilter)) {
      statusItems = buildFormItemsByDicts('S4Y_S7T_SS_STATUS', 'el-option')
    } else {
      let statusOptions = getters.getDicts('S4Y_S7T_SS_STATUS')
      statusOptions = statusOptions.filter(statusOption => {
        if (statusFilter.includes(statusOption.value)) {
          return true
        }
        return false
      })
      statusItems = buildFormItems(statusOptions, 'value', 'title', 'el-option')
    }
    items.push({
      props: { label: '状态', prop: 'SS_STATUS' },
      items: [
        {
          tag: 'el-select',
          name: 'SS_STATUS',
          items: statusItems
        }
      ]
    })
    items.push({
      props: { label: '校验状态', prop: 'SS_VERIFY_STATUS' },
      items: [
        {
          tag: 'el-select',
          name: 'SS_VERIFY_STATUS',
          items: buildFormItemsByDicts('S4Y_S7T_SS_VERIFY_STATUS', 'el-option')
        }
      ]
    })
  }
  return {
    extraParams: { SS_STATUS: statusFilter },
    items
  }
}

export function getSalarySnapshootTableItems(formatters) {
  const items = []
  const getters = store.getters
  items.push({
    props: {
      label: '员工号',
      prop: 'SS_STAFF_NUMBER',
      fixed: 'left',
      width: '150'
    }
  })
  items.push({
    props: {
      label: '姓名',
      prop: 'SS_STAFF_NAME',
      fixed: 'left',
      width: '125'
    }
  })
  items.push({
    props: {
      label: '期次号',
      prop: 'SS_ISSUE',
      fixed: 'left',
      align: 'center',
      width: '100'
    }
  })
  items.push({
    props: {
      label: '薪金类型',
      prop: 'SS_TYPE',
      align: 'center',
      width: '100',
      formatter: function(row, column, cellValue, index) {
        return getters.getDictTitle('S4Y_S7T_SS_TYPE', cellValue)
      }
    }
  })
  items.push({
    props: {
      label: '发放模式',
      prop: 'SS_PAY_TYPE',
      align: 'center',
      width: '100',
      formatter: function(row, column, cellValue, index) {
        return getters.getDictTitle('S4Y_S7T_SS_PAY_TYPE', cellValue)
      }
    }
  })
  items.push({
    props: {
      label: '发放主体',
      prop: 'SS_PAY_ENTERPRISE_NAME',
      width: '175'
    }
  })
  items.push({
    props: {
      label: '状态',
      prop: 'SS_STATUS',
      width: '125',
      formatter: function(row, column, cellValue, index) {
        const formatter = formatters['SS_STATUS']
        if (validator.isNotEmpty(formatter)) {
          const salarySnapshoot = getSalarySnapshootId(row)
          return formatter(salarySnapshoot, row)
        } else {
          return getters.getDictTitle('S4Y_S7T_SS_STATUS', cellValue)
        }
      }
    }
  })
  items.push({
    props: {
      label: '校验状态',
      prop: 'SS_VERIFY_STATUS',
      align: 'center',
      width: '100',
      formatter: function(row, column, cellValue, index) {
        return getters.getDictTitle('S4Y_S7T_SS_VERIFY_STATUS', cellValue)
      }
    }
  })
  items.push({
    props: { prop: 'fill' }
  })
  items.push({
    props: {
      label: '操作',
      prop: 'action',
      fixed: 'right',
      width: '200',
      formatter: function(row, column, cellValue, index) {
        const formatter = formatters['action']
        const salarySnapshoot = getSalarySnapshootId(row)
        return formatter(salarySnapshoot, row)
      }
    }
  })
  return items
}

function buildSSWageItem(name, label, disabled) {
  return {
    props: {
      label,
      prop: name,
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
          tag: 'el-input',
          name,
          props: { disabled },
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
        label,
        prop: name,
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
export function getSalarySnapshootFormItems(operate, model, configs) {
  // operate add | edit | view
  const items = []
  const { enterpriseOptions, loadStaffs, loadSalary } = configs
  if (validator.isNotEmpty(enterpriseOptions)) {
    const getters = store.getters
    let readonly_pk = false
    let readonly = false
    if (operate === 'edit') {
      readonly_pk = true
    } else if (operate === 'view') {
      readonly_pk = true
      readonly = true
    }
    items.push({
      props: { label: '频度', prop: 'SS_FREQ' },
      items: buildFormItemsByDicts('S4Y_S7T_SS_FREQ', 'el-radio', 'SS_FREQ', {
        props: { disabled: readonly_pk }
      })
    })
    items.push({
      props: {
        label: '期次号',
        prop: 'SS_ISSUE',
        rules: [
          { required: true, message: '请选择期次号', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-date-picker',
          name: 'SS_ISSUE',
          props: { type: 'month', disabled: readonly_pk }
        }
      ]
    })
    items.push({
      props: { label: '薪金类型', prop: 'SS_TYPE' },
      items: buildFormItemsByDicts('S4Y_S7T_SS_TYPE', 'el-radio', 'SS_TYPE', {
        props: { disabled: readonly_pk }
      })
    })
    const loadSalarySlots = []
    if (!readonly_pk && validator.isNotEmpty(loadSalary)) {
      loadSalarySlots.push({
        slot: 'append',
        COM: {
          tag: 'el-button',
          props: { icon: 'el-icon-antd-download' },
          events: {
            click: function() {
              loadSalary(operate, model)
            }
          }
        }
      })
    }
    items.push({
      props: {
        label: '员工号',
        prop: 'SS_STAFF_NUMBER',
        rules: [
          { required: true, message: '请输入员工号', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-autocomplete-wrap',
          name: 'SS_STAFF_NUMBER',
          linkage: true,
          props: {
            placeholder: '请输入员工号 / 姓名 ...',
            'value-key': 'S_NUMBER',
            'trigger-on-focus': false,
            'fetch-suggestions': function(queryString, callback) {
              loadStaffs(operate, model, queryString, callback)
            },
            slots: loadSalarySlots,
            template: [
              { tag: 'div', style: '', prop: 'S_NAME' },
              { tag: 'div', style: 'line-height: 18px; font-size: 12px; color: #b4b4b4; padding-left: 14px', prop: 'S_NUMBER' }
            ],
            disabled: readonly_pk
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
      validator.isEmpty(SS_FREQ) ||
      validator.isEmpty(SS_ISSUE) ||
      validator.isEmpty(SS_STAFF_NUMBER) ||
      validator.isEmpty(SS_TYPE)
    ) {
      return items
    }
    items.push({ tag: 'el-new-row', title: '发放信息' })
    items.push({
      props: { label: '发放地', prop: 'SS_PAY_SITE' },
      items: [
        {
          tag: 'el-cascader',
          name: 'SS_PAY_SITE',
          props: { options: getters.getDistricts, disabled: true }
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
        label: '发放主体',
        prop: 'SS_PAY_ENTERPRISE_ID',
        rules: [
          { required: true, message: '请输入发放主体', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-select',
          name: 'SS_PAY_ENTERPRISE_ID',
          props: { disabled: true },
          items: buildFormItems(enterpriseOptions, 'E_ID', 'E_NAME', 'el-option')
        }
      ]
    })
    items.push({
      props: {
        label: '预计发放日期',
        prop: 'SS_PREDICT_PAY_DATE',
        rules: [
          { required: true, message: '请选择预计发放日期', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-date-picker',
          name: 'SS_PREDICT_PAY_DATE',
          props: { disabled: readonly }
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

export function getPayrollId(payroll) {
  return {
    P_FREQ: payroll.P_FREQ,
    P_ISSUE: payroll.P_ISSUE,
    P_STAFF_NUMBER: payroll.P_STAFF_NUMBER,
    P_TYPE: payroll.P_TYPE
  }
}

export function getPayrollSearcher(statusFilter) {
  const items = []
  const getters = store.getters
  items.push({
    props: { label: '期次号', prop: 'P_ISSUE' },
    items: [
      {
        tag: 'el-date-picker',
        name: 'P_ISSUE',
        props: { type: 'month' }
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
  if (validator.isEmpty(statusFilter)) {
    statusItems = buildFormItemsByDicts('P5L_P_STATUS', 'el-option')
  } else {
    let statusOptions = getters.getDicts('P5L_P_STATUS')
    statusOptions = statusOptions.filter(statusOption => {
      if (statusFilter.includes(statusOption.value)) {
        return true
      }
      return false
    })
    statusItems = buildFormItems(statusOptions, 'value', 'title', 'el-option')
  }
  items.push({
    props: { label: '状态', prop: 'P_STATUS' },
    items: [
      {
        tag: 'el-select',
        name: 'P_STATUS',
        items: statusItems
      }
    ]
  })
  return {
    extraParams: { P_STATUS: statusFilter },
    items
  }
}

export function getPayrollTableItems(formatters) {
  const items = []
  const getters = store.getters
  items.push({
    props: {
      label: '员工号',
      prop: 'P_STAFF_NUMBER',
      fixed: 'left',
      width: '150'
    }
  })
  items.push({
    props: {
      label: '姓名',
      prop: 'P_STAFF_NAME',
      fixed: 'left',
      width: '125'
    }
  })
  items.push({
    props: {
      label: '期次号',
      prop: 'P_ISSUE',
      fixed: 'left',
      align: 'center',
      width: '100'
    }
  })
  items.push({
    props: {
      label: '预计发放日期',
      prop: 'P_PREDICT_PAY_DATE',
      align: 'center',
      width: '125'
    }
  })
  items.push({
    props: {
      label: '实际发放日期',
      prop: 'P_ACTUAL_PAY_DATE',
      align: 'center',
      width: '125'
    }
  })
  items.push({
    props: {
      label: '待发工资',
      prop: 'P_WAGE_TOTAL',
      width: '100'
    }
  })
  items.push({
    props: {
      label: '实发工资',
      prop: 'P_WAGE_ACTUAL',
      width: '100'
    }
  })
  items.push({
    props: {
      label: '状态',
      prop: 'P_STATUS',
      width: '125',
      formatter: function(row, column, cellValue, index) {
        const formatter = formatters['P_STATUS']
        if (validator.isNotEmpty(formatter)) {
          const payroll = getPayrollId(row)
          return formatter(payroll, row)
        } else {
          return getters.getDictTitle('P5L_P_STATUS', cellValue)
        }
      }
    }
  })
  items.push({
    props: { prop: 'fill' }
  })
  items.push({
    props: {
      label: '操作',
      prop: 'action',
      fixed: 'right',
      width: '100',
      formatter: function(row, column, cellValue, index) {
        const formatter = formatters['action']
        const payroll = getPayrollId(row)
        return formatter(payroll, row)
      }
    }
  })
  return items
}

export function getPayrollFormItems(operate, model) {
  // operate view
  const items = []
  const readonly_pk = true
  const readonly = true
  items.push({
    props: { label: '频度', prop: 'P_FREQ' },
    items: buildFormItemsByDicts('P5L_P_FREQ', 'el-radio', 'P_FREQ', {
      props: { disabled: readonly_pk }
    })
  })
  items.push({
    props: { label: '期次号', prop: 'P_ISSUE' },
    items: [
      {
        tag: 'el-date-picker',
        name: 'P_ISSUE',
        props: { type: 'month', disabled: readonly_pk }
      }
    ]
  })
  items.push({
    props: { label: '员工号', prop: 'P_STAFF_NUMBER' },
    items: [
      {
        tag: 'el-input',
        name: 'P_STAFF_NUMBER',
        props: { disabled: readonly_pk }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '预计发放日期', prop: 'P_PREDICT_PAY_DATE' },
    items: [
      {
        tag: 'el-date-picker',
        name: 'P_PREDICT_PAY_DATE',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '实际发放日期', prop: 'P_ACTUAL_PAY_DATE' },
    items: [
      {
        tag: 'el-date-picker',
        name: 'P_ACTUAL_PAY_DATE',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '待发工资', prop: 'P_WAGE_TOTAL' },
    items: [
      {
        tag: 'el-input-number',
        name: 'P_WAGE_TOTAL',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '附加扣除总额', prop: 'P_A8L_D4T_TOTAL' },
    items: [
      {
        tag: 'el-input-number',
        name: 'P_A8L_D4T_TOTAL',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '应税工资', prop: 'P_WAGE_TAX' },
    items: [
      {
        tag: 'el-input-number',
        name: 'P_WAGE_TAX',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '个税缴纳总额', prop: 'P_PIT_TOTAL' },
    items: [
      {
        tag: 'el-input-number',
        name: 'P_PIT_TOTAL',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '五险一金个人缴纳总额', prop: 'P_5I1F_P_TOTAL' },
    items: [
      {
        tag: 'el-input-number',
        name: 'P_5I1F_P_TOTAL',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '五险一金企业缴纳总额', prop: 'P_5I1F_E_TOTAL' },
    items: [
      {
        tag: 'el-input-number',
        name: 'P_5I1F_E_TOTAL',
        props: { disabled: readonly }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '实发工资', prop: 'P_WAGE_ACTUAL' },
    items: [
      {
        tag: 'el-input-number',
        name: 'P_WAGE_ACTUAL',
        props: { disabled: readonly }
      }
    ]
  })
  return items
}
