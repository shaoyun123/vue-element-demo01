import moment from 'moment'
import { passable, parallel } from '@/utils/request'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { showMessage, showConfirm, showPrompt, showLoading } from '@/utils/element'
import { buildTableActions, buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'
import {
  serverThemeList,
  serverThemeSingleById,
  serverThemeDeleteByIds,
  serverThemeSave,
  serverList,
  serverSingleById,
  serverDeleteByIds,
  serverSave,
  servicePackageList,
  servicePackageSingleById,
  servicePackageDeleteByIds,
  servicePackageSave,
  servicePackageMeasure,
  customerList,
  customerSingleById,
  customerDeleteByIds,
  customerSave,
  callLogList,
  callLogStatistics,
  callLogStatisticsAll,
  callStatisticsList,
  callStatisticsByGlobal,
  callStatisticsByServer,
  callStatisticsByCustomer,
  callStatisticsLogList
} from '@/api/sbs'

function addFormGroupItem(vm, field, value) {
  const model = vm.getModel()
  const list = model[field] || []
  list.push(value)
  model[field] = list
  vm.handleDialogInput(model)
}

function delFormGroupItem(vm, field, index) {
  showConfirm({ content: '是否删除此组数据 ？', type: 'warning' }).then(() => {
    const model = vm.getModel()
    const list = model[field] || []
    list.splice(index, 1)
    model[field] = list
    vm.handleDialogInput(model)
  }).catch(() => {})
}

function upFormGroupItem(vm, field, index) {
  if (index > 0) {
    const model = vm.getModel()
    const list = model[field] || []
    const val = list[index]
    list[index] = list[index - 1]
    list[index - 1] = val
    model[field] = list
    vm.handleDialogInput(model)
  }
}

function downFormGroupItem(vm, field, index, size) {
  if (index < size - 1) {
    const model = vm.getModel()
    const list = model[field] || []
    const val = list[index]
    list[index] = list[index + 1]
    list[index + 1] = val
    model[field] = list
    vm.handleDialogInput(model)
  }
}

function getServerThemeFormItems(vm, scopeMeta, operate, model) {
  const items = []
  let readonly = false
  if (operate === 'view') {
    readonly = true
  }
  items.push({
    props: {
      label: '标题', prop: 'title',
      rules: [
        { required: true, message: '请输入标题', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input', name: 'title', props: { disabled: readonly }
      }
    ]
  })
  items.push({
    props: { label: '说明', prop: 'descr' },
    items: [
      {
        tag: 'el-input', name: 'descr', props: { type: 'textarea', disabled: readonly }
      }
    ]
  })
  return items
}

function deleteServerTheme(vm) {
  const checkedNodes = vm.ref().refCategory().checkedNodes
  if (isNotEmpty(checkedNodes)) {
    showConfirm({ content: '是否删除数据 ？', type: 'warning' }).then(() => {
      const ids = checkedNodes.map(checkedNode => {
        return checkedNode.id
      })
      serverThemeDeleteByIds(ids).then(response => {
        vm.ref().refresh()
      })
    }).catch(() => {})
  }
}

function getServerSearcherItems(vm, scopeMeta) {
  const items = []
  items.push({
    props: { label: '服务编号', prop: 'id' },
    items: [
      { tag: 'el-input', name: 'id' }
    ]
  })
  items.push({
    props: { label: '服务标题', prop: 'title' },
    items: [
      { tag: 'el-input', name: 'title' }
    ]
  })
  items.push({
    props: { label: '状态', prop: 'status' },
    items: [
      { tag: 'el-select', name: 'status', items: buildFormItemsByDicts('s4r_status', 'el-option') }
    ]
  })
  return items
}

function getServerTableItems(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const items = []
  items.push({
    props: { label: '服务编号', prop: 'id', fixed: 'left', width: '125' }
  })
  items.push({
    props: { label: '服务标题', prop: 'title', fixed: 'left', width: '250' }
  })
  items.push({
    props: { label: '服务通道', prop: 'channel', width: '625' }
  })
  items.push({
    props: {
      label: '状态', prop: 'status', width: '75',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('s4r_status', cellValue)
      }
    }
  })
  items.push({
    props: { label: '创建时间', prop: 'creationTime', width: '175' }
  })
  items.push({
    props: { prop: 'fill' }
  })
  return items
}

function getServerFormItems(vm, scopeMeta, operate, model) {
  const items = []
  let readonlyForPivotal = false
  let readonlyForGeneral = false
  if (operate === 'edit') {
    readonlyForPivotal = true
  } else if (operate === 'view') {
    readonlyForPivotal = true
    readonlyForGeneral = true
  }
  items.push({
    props: {
      label: '服务编号', prop: 'id',
      rules: [
        { required: true, message: '请输入服务编号', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input', name: 'id', props: { disabled: readonlyForPivotal }
      }
    ]
  })
  items.push({
    props: {
      label: '服务标题', prop: 'title',
      rules: [
        { required: true, message: '请输入服务标题', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input', name: 'title', props: { disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({
    props: { label: '说明', prop: 'descr' },
    items: [
      {
        tag: 'el-input', name: 'descr', props: { type: 'textarea', disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: {
      label: '服务通道', prop: 'channel',
      rules: [
        { required: true, message: '请输入服务通道', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input', name: 'channel', props: { disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({
    props: { label: '文档通道', prop: 'docChannel' },
    items: [
      {
        tag: 'el-input', name: 'docChannel', props: { disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({ tag: 'el-new-group', title: '服务通道参数' })
  const serverParams = model.params
  if (isNotEmpty(serverParams)) {
    const { getValidators, getValidatorParamDescr } = vm.$store.getters
    const validators = buildFormItems(getValidators, 'clazz', 'title', 'el-option')
    const size = serverParams.length
    serverParams.forEach((serverParam, i) => {
      const validator = serverParam.validator
      const prefix = `params.${i}.`
      const actions = []
      if (!readonlyForGeneral) {
        actions.push({ tip: '上移', icon: 'el-icon-antd-up', click: () => upFormGroupItem(vm, 'params', i) })
        actions.push({ tip: '下移', icon: 'el-icon-antd-down', click: () => downFormGroupItem(vm, 'params', i, size) })
        actions.push({ tip: '删除', icon: 'el-icon-antd-delete', click: () => delFormGroupItem(vm, 'params', i) })
      }
      items.push({ tag: 'el-new-row', title: `第 ${i + 1} 组`, actions })
      items.push({
        props: {
          label: '键', prop: prefix + 'key',
          rules: [
            { required: true, message: '请输入键', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input', name: prefix + 'key', props: { disabled: readonlyForGeneral }
          }
        ]
      })
      items.push({
        props: { label: '可空', prop: prefix + 'nullable' },
        items: buildFormItemsByDicts('YN', 'el-radio', prefix + 'nullable', {
          props: { disabled: readonlyForGeneral }
        })
      })
      items.push({
        props: {
          label: '检验器', prop: prefix + 'validator'
        },
        items: [
          {
            tag: 'el-select', name: prefix + 'validator', linkage: true, props: { clearable: true, disabled: readonlyForGeneral },
            items: validators
          }
        ]
      })
      if (isNotEmpty(validator)) {
        items.push({
          tip: getValidatorParamDescr(validator),
          props: {
            label: '检验器参数', prop: prefix + 'validatorParams'
          },
          items: [
            {
              tag: 'el-input', name: prefix + 'validatorParams', props: { disabled: readonlyForGeneral }
            }
          ]
        })
      }
    })
  }
  items.push({ tag: 'el-new-group', title: '服务商' })
  const serviceProviders = model.serviceProviders
  if (isNotEmpty(serviceProviders)) {
    const size = serviceProviders.length
    serviceProviders.forEach((serviceProvider, i) => {
      const prefix = `serviceProviders.${i}.`
      const actions = []
      if (!readonlyForGeneral) {
        actions.push({ tip: '上移', icon: 'el-icon-antd-up', click: () => upFormGroupItem(vm, 'serviceProviders', i) })
        actions.push({ tip: '下移', icon: 'el-icon-antd-down', click: () => downFormGroupItem(vm, 'serviceProviders', i, size) })
        actions.push({ tip: '删除', icon: 'el-icon-antd-delete', click: () => delFormGroupItem(vm, 'serviceProviders', i) })
      }
      items.push({ tag: 'el-new-row', title: `第 ${i + 1} 组`, actions })
      items.push({
        props: {
          label: '服务商编码', prop: prefix + 'code',
          rules: [
            { required: true, message: '请输入服务商编码', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input', name: prefix + 'code', props: { disabled: readonlyForGeneral }
          }
        ]
      })
      items.push({
        props: {
          label: '服务商名称', prop: prefix + 'name',
          rules: [
            { required: true, message: '请输入服务商名称', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input', name: prefix + 'name', props: { disabled: readonlyForGeneral }
          }
        ]
      })
    })
  }
  items.push({ tag: 'el-new-group' })
  items.push({
    props: { label: '状态', prop: 'status' },
    items: [
      {
        tag: 'el-select', name: 'status', props: { disabled: readonlyForGeneral },
        items: buildFormItemsByDicts('s4r_status', 'el-option')
      }
    ]
  })
  items.push({
    props: { label: '状态说明', prop: 'statusDescr' },
    items: [
      {
        tag: 'el-input', name: 'statusDescr', props: { type: 'textarea', disabled: readonlyForGeneral }
      }
    ]
  })
  if (operate !== 'add') {
    items.push({ tag: 'el-new-row' })
    items.push({
      props: { label: '创建时间', prop: 'creationTime' },
      items: [
        {
          tag: 'el-input', name: 'creationTime', props: { disabled: true }
        }
      ]
    })
    items.push({
      props: { label: '最后修改时间', prop: 'modificationTime' },
      items: [
        {
          tag: 'el-input', name: 'modificationTime', props: { disabled: true }
        }
      ]
    })
  }
  return items
}

function deleteServer(vm) {
  const selectedRows = vm.getFlowActionData()
  if (isNotEmpty(selectedRows)) {
    showConfirm({ content: '是否删除数据 ？', type: 'warning' }).then(() => {
      const ids = selectedRows.map(selectedRow => {
        return selectedRow.id
      })
      serverDeleteByIds(ids).then(response => {
        vm.ref().refTable().doSearch()
      })
    }).catch(() => {})
  }
}

const SM_ServerList = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'ServerThemeEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
        props: { scope: 'ServerThemeEdit' },
        events: { 'after-save': () => vm.refresh() }
      })
      components.push({
        name: 'ServerEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
        props: { scope: 'ServerEdit' },
        events: { 'after-save': () => vm.refresh() }
      })
      return components
    },
    categoryController: function(vm, scopeMeta) {
      return {
        items: [
          {
            text: '新增', props: { icon: 'el-icon-antd-plus' }, events: { click: () => vm.ref('ServerThemeEdit').showDialog({}) }
          },
          {
            selectedRowVisible: true, text: '删除', props: { icon: 'el-icon-antd-delete', type: 'danger' },
            events: {
              click: function() {
                deleteServerTheme(vm)
              }
            }
          }
        ]
      }
    },
    categoryTree: function(vm, scopeMeta) {
      return {
        props: {
          'node-key': 'id',
          props: {
            label: function(data, node) {
              return data.title
            },
            isLeaf: function(data, node) {
              return true
            }
          },
          lazy: true,
          load: (node, resolve) => {
            serverThemeList({}).then(response => {
              if (passable(response)) {
                resolve(response.data.items)
              }
            })
          }
        },
        menu: {
          command: (command, data) => {
            if (command === 'edit') {
              vm.ref('ServerThemeEdit').showDialog({ id: data.id })
            }
          },
          items: [
            {
              text: '编辑', props: { command: 'edit', icon: 'el-icon-antd-edit' }
            }
          ]
        }
      }
    },
    linkageMethod: function(vm, scopeMeta) {
      return (data, node) => {
        return { themeId: data.id }
      }
    },
    controller: function(vm, scopeMeta) {
      const items = []
      items.push({
        text: '新增', props: { icon: 'el-icon-antd-plus' },
        events: {
          click: () => {
            const linkageValue = vm.ref().linkageValue
            if (isNotEmpty(vm.ref().linkageValue)) {
              vm.ref('ServerEdit').showDialog({}, linkageValue)
            } else {
              showMessage({ content: '请选择服务主题', type: 'warning' })
            }
          }
        }
      })
      items.push({
        selectedRowVisible: true, text: '删除', props: { icon: 'el-icon-antd-delete', type: 'danger' }, events: { click: () => deleteServer(vm) }
      })
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const items = getServerSearcherItems(vm, scopeMeta)
        return { items }
      }
    },
    table: function(vm, scopeMeta) {
      const items = getServerTableItems(vm, scopeMeta)
      items.push({
        props: {
          label: '操作', prop: 'action', fixed: 'right', width: '100',
          formatter: function(row, column, cellValue, index) {
            const id = row.id
            const actions = []
            actions.push({ title: '编辑', click: () => vm.ref('ServerEdit').showDialog({ id }) })
            return buildTableActions(vm, actions)
          }
        }
      })
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return serverList
    }
  }
}

const SM_ServerThemeEdit = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '服务主题信息'
    },
    defaultModel: function(vm, scopeMeta) {
      return {}
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getServerThemeFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return serverThemeSingleById
    },
    saveMethod: function(vm, scopeMeta) {
      return serverThemeSave
    }
  }
}

const SM_ServerEdit = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '服务信息'
    },
    defaultModel: function(vm, scopeMeta) {
      return {
        status: 'ONLINE'
      }
    },
    controller: function(vm, scopeMeta) {
      const items = []
      items.push({
        tip: '添加通道参数', props: { icon: 'el-icon-antd-number' },
        events: {
          click: () => addFormGroupItem(vm, 'params', { key: '', nullable: 'N', validator: '', validatorParams: '' })
        }
      })
      items.push({
        tip: '添加服务商', props: { icon: 'el-icon-antd-robot' },
        events: {
          click: () => addFormGroupItem(vm, 'serviceProviders', { code: '', name: '' })
        }
      })
      return { items }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getServerFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return serverSingleById
    },
    saveMethod: function(vm, scopeMeta) {
      return serverSave
    },
    beforeSave: function(vm, scopeMeta) {
      return (operate, model) => {
        const content = []
        /*
        if (isEmpty(model.params)) {
          content.push('服务通道参数不能为空')
        }
        */
        if (isEmpty(model.serviceProviders)) {
          content.push('服务商不能为空')
        }
        if (isNotEmpty(content)) {
          showMessage({ content, type: 'warning' })
          return false
        } else {
          return true
        }
      }
    }
  }
}

const SM_ServerView = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '服务信息'
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getServerFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return serverSingleById
    }
  }
}

function getServicePackageSearcherItems(vm, scopeMeta) {
  const items = []
  items.push({
    props: { label: '服务编号', prop: 'serverId' },
    items: [
      { tag: 'el-input', name: 'serverId' }
    ]
  })
  items.push({
    props: { label: '状态', prop: 'status' },
    items: [
      { tag: 'el-select', name: 'status', items: buildFormItemsByDicts('s12e_status', 'el-option') }
    ]
  })
  return items
}

function getServicePackageTableItems(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const items = []
  items.push({
    props: { label: '服务编号', prop: 'serverId', fixed: 'left', width: '125' }
  })
  items.push({
    props: { label: '套餐开始日期', prop: 'startDate', width: '125' }
  })
  items.push({
    props: { label: '套餐结束日期', prop: 'endDate', width: '125' }
  })
  items.push({
    props: {
      label: '状态', prop: 'status', width: '100',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('s12e_status', cellValue)
      }
    }
  })
  items.push({
    props: { label: '创建时间', prop: 'creationTime', width: '175' }
  })
  items.push({
    props: { prop: 'fill' }
  })
  return items
}

function getServicePackageFormItems(vm, scopeMeta, operate, model) {
  const items = []
  let readonlyForPivotal = false
  let readonlyForGeneral = false
  if (operate === 'edit') {
    readonlyForPivotal = true
  } else if (operate === 'view') {
    readonlyForPivotal = true
    readonlyForGeneral = true
  }
  const serverId = model.serverId
  if (operate !== 'add') {
    items.push({
      props: { label: '客户号', prop: 'customerId' },
      items: [
        {
          tag: 'el-input', name: 'customerId', props: { disabled: true }
        }
      ]
    })
  }
  const loadServerSlots = []
  if (operate !== 'view' && isNotEmpty(serverId)) {
    loadServerSlots.push({
      slot: 'append',
      COM: {
        tag: 'el-button',
        props: { icon: 'el-icon-antd-sync' },
        events: {
          click: function() {
            serverSingleById({ id: serverId }).then(response => {
              if (passable(response)) {
                const server = response.data
                if (isNotEmpty(server)) {
                  model.serviceProviders = server.serviceProviders
                  vm.handleDialogInput(model)
                }
              }
            })
          }
        }
      }
    })
  }
  items.push({
    props: {
      label: '服务编号', prop: 'serverId',
      rules: [
        { required: true, message: '请输入服务编号', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-autocomplete-wrap', name: 'serverId', linkage: true,
        props: {
          placeholder: '服务编号 / 标题 ...', 'value-key': 'id', 'trigger-on-focus': false,
          'fetch-suggestions': function(queryString, callback) {
            serverList({ idOrTitle: queryString }).then(response => {
              if (passable(response)) {
                callback(response.data.items)
              }
            })
          },
          slots: loadServerSlots,
          template: [
            { tag: 'div', style: '', prop: 'id' },
            { tag: 'div', style: 'line-height: 18px; font-size: 12px; color: #b4b4b4; padding-left: 14px', prop: 'title' }
          ],
          disabled: readonlyForPivotal
        }
      }
    ]
  })
  items.push({
    props: {
      label: '套餐开始日期', prop: 'startDate',
      rules: [
        { required: true, message: '请选择套餐开始日期', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-date-picker', name: 'startDate', props: { disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({
    props: {
      label: '套餐结束日期', prop: 'endDate',
      rules: [
        { required: true, message: '请选择套餐结束日期', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            const _model = vm.ref().getModel()
            const startDate = _model.startDate
            const endDate = _model.endDate
            if (isNotEmpty(startDate) && isNotEmpty(endDate)) {
              const dateStart = moment(startDate)
              const dateEnd = moment(endDate)
              if (dateStart.isBefore(dateEnd)) {
                callback()
              } else {
                callback(new Error('套餐结束日期不能小于或等于套餐开始日期'))
              }
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
        tag: 'el-date-picker', name: 'endDate', props: { disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({ tag: 'el-new-group', title: '服务商' })
  const serviceProviders = model.serviceProviders
  if (isNotEmpty(serviceProviders)) {
    const size = serviceProviders.length
    serviceProviders.forEach((serviceProvider, i) => {
      const prefix = `serviceProviders.${i}.`
      const actions = []
      if (!readonlyForGeneral) {
        actions.push({ tip: '上移', icon: 'el-icon-antd-up', click: () => upFormGroupItem(vm, 'serviceProviders', i) })
        actions.push({ tip: '下移', icon: 'el-icon-antd-down', click: () => downFormGroupItem(vm, 'serviceProviders', i, size) })
        actions.push({ tip: '删除', icon: 'el-icon-antd-delete', click: () => delFormGroupItem(vm, 'serviceProviders', i) })
      }
      items.push({ tag: 'el-new-row', title: `第 ${i + 1} 组`, actions })
      items.push({
        props: { label: '服务商编码', prop: prefix + 'code' },
        items: [
          {
            tag: 'el-input', name: prefix + 'code', props: { disabled: true }
          }
        ]
      })
      items.push({
        props: { label: '服务商名称', prop: prefix + 'name' },
        items: [
          {
            tag: 'el-input', name: prefix + 'name', props: { disabled: true }
          }
        ]
      })
    })
  }
  items.push({ tag: 'el-new-group', title: '付费规则' })
  const payRules = model.payRules
  if (isNotEmpty(payRules)) {
    const size = payRules.length
    payRules.forEach((payRule, i) => {
      const prefix = `payRules.${i}.`
      const actions = []
      if (!readonlyForGeneral) {
        actions.push({ tip: '上移', icon: 'el-icon-antd-up', click: () => upFormGroupItem(vm, 'payRules', i) })
        actions.push({ tip: '下移', icon: 'el-icon-antd-down', click: () => downFormGroupItem(vm, 'payRules', i, size) })
        actions.push({ tip: '删除', icon: 'el-icon-antd-delete', click: () => delFormGroupItem(vm, 'payRules', i) })
      }
      items.push({ tag: 'el-new-row', title: `第 ${i + 1} 组`, actions })
      items.push({
        tip: '0 表示无限制',
        props: {
          label: '计费量', prop: prefix + 'quantity',
          rules: [
            { required: true, message: '请输入计费量', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input-number', name: prefix + 'quantity',
            props: { min: 0, precision: 0, disabled: readonlyForGeneral }
          }
        ]
      })
      items.push({
        props: { label: '计价方式', prop: prefix + 'valuationMode' },
        items: buildFormItemsByDicts('p5e_valuationMode', 'el-radio', prefix + 'valuationMode', {
          props: { disabled: readonlyForGeneral }
        })
      })
      items.push({
        tip: '单位元',
        props: {
          label: '价格', prop: prefix + 'price',
          rules: [
            { required: true, message: '请输入价格', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input-number', name: prefix + 'price',
            props: { min: 0, precision: 4, disabled: readonlyForGeneral }
          }
        ]
      })
    })
  }
  items.push({ tag: 'el-new-group' })
  items.push({
    props: { label: '状态', prop: 'status' },
    items: [
      {
        tag: 'el-select', name: 'status', props: { disabled: readonlyForGeneral },
        items: buildFormItemsByDicts('s12e_status', 'el-option') }
    ]
  })
  items.push({
    props: { label: '状态说明', prop: 'statusDescr' },
    items: [
      {
        tag: 'el-input', name: 'statusDescr', props: { type: 'textarea', disabled: readonlyForGeneral }
      }
    ]
  })
  if (operate !== 'add') {
    items.push({ tag: 'el-new-row' })
    items.push({
      props: { label: '创建时间', prop: 'creationTime' },
      items: [
        {
          tag: 'el-input', name: 'creationTime', props: { disabled: true }
        }
      ]
    })
    items.push({
      props: { label: '最后修改时间', prop: 'modificationTime' },
      items: [
        {
          tag: 'el-input', name: 'modificationTime', props: { disabled: true }
        }
      ]
    })
  }
  return items
}

function deleteServicePackage(vm) {
  const selectedRows = vm.getFlowActionData()
  if (isNotEmpty(selectedRows)) {
    showConfirm({ content: '是否删除数据 ？', type: 'warning' }).then(() => {
      const ids = selectedRows.map(selectedRow => {
        return selectedRow.id
      })
      servicePackageDeleteByIds(ids).then(response => {
        vm.refresh()
      })
    }).catch(() => {})
  }
}

function loadServicePackageTemplate(vm, scopeMeta, row, index) {
  vm.$emit('load-template', row)
  vm.hideDialog()
}

const SM_ServicePackageList = () => {
  return {
    components: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      const components = []
      if (routerName === 'SBS-ServicePackageTemplate') {
        components.push({
          name: 'ServicePackageTemplateEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
          props: { scope: 'ServicePackageTemplateEdit' },
          events: { 'after-save': () => vm.refresh() }
        })
        components.push({
          name: 'ServicePackageMeasureView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
          props: { scope: 'ServicePackageMeasureView' }
        })
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageList') {
          components.push({
            name: 'ServicePackageEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
            props: { scope: 'ServicePackageEdit' },
            events: { 'after-save': () => vm.refresh() }
          })
          components.push({
            name: 'ServicePackageMeasureView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
            props: { scope: 'ServicePackageMeasureView' }
          })
        } else if (scope === 'ServicePackageTemplateSelect') {
          components.push({
            name: 'ServicePackageTemplateView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
            props: { scope: 'ServicePackageTemplateView' }
          })
        }
      }
      return components
    },
    formTitle: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      let formTitle = '套餐列表'
      if (routerName === 'SBS-ServicePackageTemplate') {
        formTitle = '套餐模板列表'
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageList') {
          // -
        } else if (scope === 'ServicePackageTemplateSelect') {
          formTitle = '套餐模板列表'
        }
      }
      return formTitle
    },
    controller: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      const items = []
      if (routerName === 'SBS-ServicePackageTemplate') {
        items.push({
          text: '新增', props: { icon: 'el-icon-antd-plus' }, events: { click: () => vm.ref('ServicePackageTemplateEdit').showDialog({}) }
        })
        items.push({
          selectedRowVisible: true, text: '删除', props: { icon: 'el-icon-antd-delete', type: 'danger' }, events: { click: () => deleteServicePackage(vm) }
        })
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageList') {
          items.push({
            text: '新增', props: { icon: 'el-icon-antd-plus' }, events: { click: () => vm.ref('ServicePackageEdit').showDialog({}, vm.extraParams) }
          })
          items.push({
            selectedRowVisible: true, text: '删除', props: { icon: 'el-icon-antd-delete', type: 'danger' }, events: { click: () => deleteServicePackage(vm) }
          })
        } else if (scope === 'ServicePackageTemplateSelect') {
          // -
        }
      }
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const { routerName, scope } = scopeMeta
        const items = getServicePackageSearcherItems(vm, scopeMeta)
        const searcher = { items }
        if (routerName === 'SBS-ServicePackageTemplate') {
          searcher.extraParams = { customerId: 'TEMPLATE' }
        } else if (routerName === 'SBS-Customer') {
          if (scope === 'ServicePackageList') {
            // -
          } else if (scope === 'ServicePackageTemplateSelect') {
            searcher.extraParams = { customerId: 'TEMPLATE' }
          }
        }
        return searcher
      }
    },
    table: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      const items = getServicePackageTableItems(vm, scopeMeta)
      if (routerName === 'SBS-ServicePackageTemplate') {
        items.push({
          props: {
            label: '操作', prop: 'action', fixed: 'right', width: '100',
            formatter: function(row, column, cellValue, index) {
              const id = row.id
              const actions = []
              actions.push({ title: '编辑', click: () => vm.ref('ServicePackageTemplateEdit').showDialog({ id }) })
              actions.push({
                title: '测算',
                click: () => {
                  showPrompt({ content: '请输入服务访问次数', title: '测算' })
                    .then(({ value }) => vm.ref('ServicePackageMeasureView').showDialog({ id, count: value }))
                    .catch(() => {})
                }
              })
              return buildTableActions(vm, actions)
            }
          }
        })
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageList') {
          items.push({
            props: {
              label: '操作', prop: 'action', fixed: 'right', width: '100',
              formatter: function(row, column, cellValue, index) {
                const id = row.id
                const actions = []
                actions.push({ title: '编辑', click: () => vm.ref('ServicePackageEdit').showDialog({ id }) })
                actions.push({
                  title: '测算',
                  click: () => {
                    showPrompt({ content: '请输入服务访问次数', title: '测算' })
                      .then(({ value }) => vm.ref('ServicePackageMeasureView').showDialog({ id, count: value }))
                      .catch(() => {})
                  }
                })
                return buildTableActions(vm, actions)
              }
            }
          })
        } else if (scope === 'ServicePackageTemplateSelect') {
          items.push({
            props: {
              label: '操作', prop: 'action', fixed: 'right', width: '150',
              formatter: function(row, column, cellValue, index) {
                const id = row.id
                const actions = []
                actions.push({ title: '载入', click: () => loadServicePackageTemplate(vm, scopeMeta, row, index) })
                actions.push({ title: '查看', click: () => vm.ref('ServicePackageTemplateView').showDialog({ id }) })
                return buildTableActions(vm, actions)
              }
            }
          })
        }
      }
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return servicePackageList
    }
  }
}

const SM_ServicePackageEdit = () => {
  return {
    components: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      const components = []
      if (routerName === 'SBS-ServicePackageTemplate') {
        if (scope === 'ServicePackageTemplateEdit') {
          // -
        }
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageEdit') {
          components.push({
            name: 'ServicePackageTemplateSelect', component: () => import(`@/components/Typography/Flow/DialogList`),
            props: { scope: 'ServicePackageTemplateSelect' },
            events: {
              'load-template': ({ id }) => {
                servicePackageSingleById({ id }).then(response => {
                  if (passable(response)) {
                    const template = response.data
                    if (isNotEmpty(template)) {
                      const model = vm.getModel()
                      model.serverId = template.serverId
                      model.serviceProviders = template.serviceProviders
                      model.payRules = template.payRules
                      vm.handleDialogInput(model)
                    }
                  }
                })
              }
            }
          })
        }
      }
      return components
    },
    formTitle: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      let formTitle = '套餐列表'
      if (routerName === 'SBS-ServicePackageTemplate') {
        if (scope === 'ServicePackageTemplateEdit') {
          formTitle = '套餐模板列表'
        }
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageEdit') {
          // -
        }
      }
      return formTitle
    },
    defaultModel: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      const defaultModel = { status: 'ENABLED' }
      if (routerName === 'SBS-ServicePackageTemplate') {
        if (scope === 'ServicePackageTemplateEdit') {
          defaultModel.customerId = 'TEMPLATE'
        }
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageEdit') {
          // -
        }
      }
      return defaultModel
    },
    controller: function(vm, scopeMeta) {
      const { routerName, scope } = scopeMeta
      const items = []
      items.push({
        tip: '添加付费规则', props: { icon: 'el-icon-antd-calculator' },
        events: {
          click: () => addFormGroupItem(vm, 'payRules', { quantity: '0', valuationMode: 'PACKAGE', price: '0' })
        }
      })
      if (routerName === 'SBS-ServicePackageTemplate') {
        if (scope === 'ServicePackageTemplateEdit') {
          // -
        }
      } else if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageEdit') {
          const operate = vm.operate
          if (operate === 'add') {
            items.push({
              tip: '载入模板', props: { icon: 'el-icon-antd-file-copy' },
              events: {
                click: () => vm.ref('ServicePackageTemplateSelect').showDialog({ customerId: 'TEMPLATE' })
              }
            })
          }
        }
      }
      return { items }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getServicePackageFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return servicePackageSingleById
    },
    saveMethod: function(vm, scopeMeta) {
      return servicePackageSave
    },
    beforeSave: function(vm, scopeMeta) {
      return (operate, model) => {
        const content = []
        if (isEmpty(model.serviceProviders)) {
          content.push('服务商不能为空')
        }
        if (isEmpty(model.payRules)) {
          content.push('付费规则不能为空')
        }
        if (isNotEmpty(content)) {
          showMessage({ content, type: 'warning' })
          return false
        } else {
          return true
        }
      }
    }
  }
}

const SM_ServicePackageView = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      let formTitle = '套餐信息'
      const { routerName, scope } = scopeMeta
      if (routerName === 'SBS-Customer') {
        if (scope === 'ServicePackageTemplateView') {
          formTitle = '套餐模板信息'
        }
      }
      return formTitle
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getServicePackageFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return servicePackageSingleById
    }
  }
}

function getServicePackageMeasureFormItems(vm, scopeMeta, operate, model) {
  const { getDictTitle } = vm.$store.getters
  const { status } = model
  const items = []
  if (status === 'TRIGGER') {
    items.push({
      props: { label: '计次开始日期', prop: 'countStartDate' },
      items: [
        {
          tag: 'el-input', name: 'countStartDate', props: { disabled: true }
        }
      ]
    })
    items.push({
      props: { label: '计次结束日期', prop: 'countEndDate' },
      items: [
        {
          tag: 'el-input', name: 'countEndDate', props: { disabled: true }
        }
      ]
    })
    items.push({ tag: 'el-new-row' })
    items.push({
      props: { label: '次数', prop: 'count' },
      items: [
        {
          tag: 'el-input', name: 'count', props: { disabled: true }
        }
      ]
    })
    items.push({
      props: { label: '未计费次数', prop: 'surplusCount' },
      items: [
        {
          tag: 'el-input', name: 'surplusCount', props: { disabled: true }
        }
      ]
    })
    items.push({
      tip: '单位元',
      props: { label: '总费用', prop: 'totalPrice' },
      items: [
        {
          tag: 'el-input-number', name: 'totalPrice', props: { precision: 4, disabled: true }
        }
      ]
    })
    items.push({ tag: 'el-new-group', title: '计费明细' })
    const billingDetails = model.billingDetails
    if (isNotEmpty(billingDetails)) {
      billingDetails.forEach((billingDetail, i) => {
        const prefix = `billingDetails.${i}.`
        const { payRule } = billingDetail
        const valuationModeTitle = getDictTitle('p5e_valuationMode', payRule.valuationMode)
        items.push({ tag: 'el-new-row', title: `第 ${i + 1} 组` })
        items.push({
          tip: '0 表示无限制',
          props: { label: '计费量', prop: prefix + 'payRule.quantity' },
          items: [
            {
              tag: 'el-input', name: prefix + 'payRule.quantity', props: { disabled: true }
            }
          ]
        })
        items.push({
          tip: '单位元',
          props: { label: valuationModeTitle, prop: prefix + 'payRule.price' },
          items: [
            {
              tag: 'el-input-number', name: prefix + 'payRule.price', props: { precision: 4, disabled: true }
            }
          ]
        })
        items.push({
          props: { label: '计数子项', prop: prefix + 'count' },
          items: [
            {
              tag: 'el-input', name: prefix + 'count', props: { disabled: true }
            }
          ]
        })
        items.push({
          tip: '单位元',
          props: { label: '费用子项', prop: prefix + 'totalPrice' },
          items: [
            {
              tag: 'el-input-number', name: prefix + 'totalPrice', props: { precision: 4, disabled: true }
            }
          ]
        })
      })
    }
  } else if (status === 'UNTRIGGER') {
    items.push({
      span: 24,
      props: { label: '未触发说明', prop: 'statusDescr' },
      items: [
        {
          tag: 'el-input', name: 'statusDescr', props: { type: 'textarea', disabled: true }
        }
      ]
    })
  }
  return items
}

const SM_ServicePackageMeasureView = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '套餐测算结果'
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getServicePackageMeasureFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return servicePackageMeasure
    }
  }
}

function getCustomerSearcherItems(vm, scopeMeta) {
  const items = []
  items.push({
    props: { label: '客户号', prop: 'id' },
    items: [
      { tag: 'el-input', name: 'id' }
    ]
  })
  items.push({
    props: { label: '客户名称', prop: 'name' },
    items: [
      { tag: 'el-input', name: 'name' }
    ]
  })
  items.push({
    props: { label: '状态', prop: 'status' },
    items: [
      { tag: 'el-select', name: 'status', items: buildFormItemsByDicts('c6r_status', 'el-option') }
    ]
  })
  return items
}

function getCustomerTableItems(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const items = []
  items.push({
    props: { label: '客户号', prop: 'id', fixed: 'left', width: '125' }
  })
  items.push({
    props: { label: '客户名称', prop: 'name', fixed: 'left', width: '250' }
  })
  items.push({
    props: { label: '客户关系路径', prop: 'idPath', width: '625' }
  })
  items.push({
    props: {
      label: '状态', prop: 'status', width: '75',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('c6r_status', cellValue)
      }
    }
  })
  items.push({
    props: { label: '创建时间', prop: 'creationTime', width: '175' }
  })
  items.push({
    props: { prop: 'fill' }
  })
  return items
}

function getCustomerFormItems(vm, scopeMeta, operate, model) {
  const items = []
  let readonlyForPivotal = false
  let readonlyForGeneral = false
  if (operate === 'edit') {
    readonlyForPivotal = true
  } else if (operate === 'view') {
    readonlyForPivotal = true
    readonlyForGeneral = true
  }
  items.push({
    props: {
      label: '客户号', prop: 'id',
      rules: [
        { required: true, message: '请输入客户号', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input', name: 'id', props: { disabled: readonlyForPivotal }
      }
    ]
  })
  items.push({
    props: {
      label: '授权码', prop: 'license',
      rules: [
        { required: true, message: '请输入授权码', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input', name: 'license', props: { disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({
    props: {
      label: '客户名称', prop: 'name',
      rules: [
        { required: true, message: '请输入客户名称', trigger: 'blur' }
      ]
    },
    items: [
      {
        tag: 'el-input', name: 'name', props: { disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({
    props: { label: '说明', prop: 'descr' },
    items: [
      {
        tag: 'el-input', name: 'descr', props: { type: 'textarea', disabled: readonlyForGeneral }
      }
    ]
  })
  items.push({
    props: {
      label: '上级客户号', prop: 'parentId'
    },
    items: [
      {
        tag: 'el-autocomplete-wrap', name: 'parentId', linkage: true,
        props: {
          placeholder: '上级客户号 / 名称 ...', 'value-key': 'id', 'trigger-on-focus': false,
          'fetch-suggestions': function(queryString, callback) {
            customerList({ idOrName: queryString }).then(response => {
              if (passable(response)) {
                callback(response.data.items)
              }
            })
          },
          template: [
            { tag: 'div', style: '', prop: 'id' },
            { tag: 'div', style: 'line-height: 18px; font-size: 12px; color: #b4b4b4; padding-left: 14px', prop: 'name' }
          ],
          disabled: readonlyForPivotal
        }
      }
    ]
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: { label: '状态', prop: 'status' },
    items: [
      {
        tag: 'el-select', name: 'status', props: { disabled: readonlyForGeneral },
        items: buildFormItemsByDicts('c6r_status', 'el-option')
      }
    ]
  })
  items.push({
    props: { label: '状态说明', prop: 'statusDescr' },
    items: [
      {
        tag: 'el-input', name: 'statusDescr', props: { type: 'textarea', disabled: readonlyForGeneral }
      }
    ]
  })
  if (operate !== 'add') {
    items.push({ tag: 'el-new-row' })
    items.push({
      props: { label: '创建时间', prop: 'creationTime' },
      items: [
        {
          tag: 'el-input', name: 'creationTime', props: { disabled: true }
        }
      ]
    })
    items.push({
      props: { label: '最后修改时间', prop: 'modificationTime' },
      items: [
        {
          tag: 'el-input', name: 'modificationTime', props: { disabled: true }
        }
      ]
    })
  }
  return items
}

function deleteCustomer(vm) {
  const selectedRows = vm.getFlowActionData()
  if (isNotEmpty(selectedRows)) {
    showConfirm({ content: '是否删除数据 ？', type: 'warning' }).then(() => {
      const ids = selectedRows.map(selectedRow => {
        return selectedRow.id
      })
      customerDeleteByIds(ids).then(response => {
        vm.refresh()
      })
    }).catch(() => {})
  }
}

const SM_CustomerList = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'CustomerEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
        props: { scope: 'CustomerEdit' },
        events: { 'after-save': () => vm.refresh() }
      })
      components.push({
        name: 'ServicePackageList', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'ServicePackageList' }
      })
      return components
    },
    controller: function(vm, scopeMeta) {
      const items = []
      items.push({
        text: '新增', props: { icon: 'el-icon-antd-plus' }, events: { click: () => vm.ref('CustomerEdit').showDialog({}) }
      })
      items.push({
        selectedRowVisible: true, text: '删除', props: { icon: 'el-icon-antd-delete', type: 'danger' }, events: { click: () => deleteCustomer(vm) }
      })
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const items = getCustomerSearcherItems(vm, scopeMeta)
        return { items }
      }
    },
    table: function(vm, scopeMeta) {
      const items = getCustomerTableItems(vm, scopeMeta)
      items.push({
        props: {
          label: '操作', prop: 'action', fixed: 'right', width: '150',
          formatter: function(row, column, cellValue, index) {
            const id = row.id
            const actions = []
            actions.push({ title: '编辑', click: () => vm.ref('CustomerEdit').showDialog({ id }) })
            actions.push({ title: '服务套餐', click: () => vm.ref('ServicePackageList').showDialog({ customerId: id }) })
            return buildTableActions(vm, actions)
          }
        }
      })
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return customerList
    }
  }
}

const SM_CustomerEdit = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '客户信息'
    },
    defaultModel: function(vm, scopeMeta) {
      return {
        status: 'ENABLED'
      }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getCustomerFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return customerSingleById
    },
    saveMethod: function(vm, scopeMeta) {
      return customerSave
    }
  }
}

const SM_CustomerView = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '客户信息'
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getCustomerFormItems(vm, scopeMeta, operate, model)
      }
    },
    getMethod: function(vm, scopeMeta) {
      return customerSingleById
    }
  }
}

function getCallStatisticsSearcherItems(vm, scopeMeta, model) {
  const { routerName } = scopeMeta
  const items = []
  if (routerName === 'SBS-CallStatistics') {
    items.push({
      props: { label: '客户号', prop: 'customerId' },
      items: [
        { tag: 'el-input', name: 'customerId' }
      ]
    })
    items.push({
      props: { label: '服务编号', prop: 'serverId' },
      items: [
        { tag: 'el-input', name: 'serverId' }
      ]
    })
    items.push({
      props: { label: '统计频度', prop: 'freq' },
      items: [
        { tag: 'el-select', name: 'freq', linkage: true, items: buildFormItemsByDicts('c12s_freq', 'el-option') }
      ]
    })
    const freq = model.freq
    if (isNotEmpty(freq)) {
      let type = ''
      if (freq === 'Y') {
        type = 'year'
      } else if (freq === 'M') {
        type = 'month'
      } else if (freq === 'D') {
        type = 'date'
      }
      items.push({
        props: { label: '频度日期', prop: 'freqDate' },
        items: [
          {
            tag: 'el-date-picker', name: 'freqDate', props: { type }
          }
        ]
      })
    }
    items.push({
      props: { label: '统计维度', prop: 'dimension' },
      items: [
        { tag: 'el-select', name: 'dimension', items: buildFormItemsByDicts('c5g_dimension', 'el-option') }
      ]
    })
  } else if (routerName === 'SBS-Analyze') {
    // -
  }
  return items
}

function getCallStatisticsTableItems(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const items = []
  items.push({
    props: {
      label: '客户号', prop: 'customerId', fixed: 'left', width: '125',
      formatter: function(row, column, cellValue, index) {
        return buildTableActions(vm, [
          { title: cellValue, click: () => vm.ref('CustomerView').showDialog({ id: cellValue }) }
        ])
      }
    }
  })
  items.push({
    props: {
      label: '服务编号', prop: 'serverId', fixed: 'left', width: '125',
      formatter: function(row, column, cellValue, index) {
        return buildTableActions(vm, [
          { title: cellValue, click: () => vm.ref('ServerView').showDialog({ id: cellValue }) }
        ])
      }
    }
  })
  items.push({
    props: {
      label: '服务套餐', prop: 'packageId', fixed: 'left', width: '100',
      formatter: function(row, column, cellValue, index) {
        return buildTableActions(vm, [
          { icon: 'el-icon-antd-detail', click: () => vm.ref('ServicePackageView').showDialog({ id: cellValue }) }
        ])
      }
    }
  })
  items.push({
    props: {
      label: '统计频度', prop: 'freq', width: '100',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('c12s_freq', cellValue)
      }
    }
  })
  items.push({
    props: { label: '频度日期', prop: 'freqDate', width: '100' }
  })
  items.push({
    props: {
      label: '统计维度', prop: 'dimension', width: '175',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('c5g_dimension', cellValue)
      }
    }
  })
  items.push({
    props: { label: '统计值', prop: 'count', width: '175' }
  })
  items.push({
    props: { label: '创建时间', prop: 'creationTime', width: '175' }
  })
  items.push({
    props: { prop: 'fill' }
  })
  return items
}

const SM_CallStatisticsList = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'CustomerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'CustomerView' }
      })
      components.push({
        name: 'ServerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServerView' }
      })
      components.push({
        name: 'ServicePackageView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServicePackageView' }
      })
      return components
    },
    formTitle: function(vm, scopeMeta) {
      const { routerName } = scopeMeta
      let title = ''
      if (routerName === 'SBS-Analyze') {
        title += '套餐使用分布'
      }
      return title
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const items = getCallStatisticsSearcherItems(vm, scopeMeta, model)
        return { items }
      }
    },
    table: function(vm, scopeMeta) {
      const items = getCallStatisticsTableItems(vm, scopeMeta)
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return callStatisticsList
    }
  }
}

function getCallLogSearcherItems(vm, scopeMeta) {
  const items = []
  items.push({
    props: { label: '客户号', prop: 'customerId' },
    items: [
      { tag: 'el-input', name: 'customerId' }
    ]
  })
  items.push({
    props: { label: '服务编号', prop: 'serverId' },
    items: [
      { tag: 'el-input', name: 'serverId' }
    ]
  })
  items.push({
    props: { label: '访问日期', prop: 'date' },
    items: [
      { tag: 'el-date-picker', name: 'date' }
    ]
  })
  items.push({
    props: { label: '统计维度', prop: 'dimension' },
    items: [
      { tag: 'el-select', name: 'dimension', items: buildFormItemsByDicts('c5g_dimension', 'el-option') }
    ]
  })
  return items
}

function getCallLogTableItems(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const items = []
  items.push({
    props: {
      label: '客户号', prop: 'customerId', fixed: 'left', width: '125',
      formatter: function(row, column, cellValue, index) {
        return buildTableActions(vm, [
          { title: cellValue, click: () => vm.ref('CustomerView').showDialog({ id: cellValue }) }
        ])
      }
    }
  })
  items.push({
    props: {
      label: '服务编号', prop: 'serverId', fixed: 'left', width: '125',
      formatter: function(row, column, cellValue, index) {
        return buildTableActions(vm, [
          { title: cellValue, click: () => vm.ref('ServerView').showDialog({ id: cellValue }) }
        ])
      }
    }
  })
  items.push({
    props: {
      label: '服务套餐', prop: 'packageId', fixed: 'left', width: '100',
      formatter: function(row, column, cellValue, index) {
        return buildTableActions(vm, [
          { icon: 'el-icon-antd-detail', click: () => vm.ref('ServicePackageView').showDialog({ id: cellValue }) }
        ])
      }
    }
  })
  items.push({
    props: { label: '访问日期', prop: 'date', width: '100' }
  })
  items.push({
    props: {
      label: '统计维度', prop: 'dimension', width: '175',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('c5g_dimension', cellValue)
      }
    }
  })
  items.push({
    props: { label: '创建时间', prop: 'creationTime', width: '175' }
  })
  items.push({
    props: { prop: 'fill' }
  })
  return items
}

const SM_CallLogList = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'CustomerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'CustomerView' }
      })
      components.push({
        name: 'ServerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServerView' }
      })
      components.push({
        name: 'ServicePackageView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServicePackageView' }
      })
      return components
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const items = getCallLogSearcherItems(vm, scopeMeta)
        return { items }
      }
    },
    table: function(vm, scopeMeta) {
      const items = getCallLogTableItems(vm, scopeMeta)
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return callLogList
    }
  }
}

function getAnalyzeFormItems(vm, scopeMeta, operate, model) {
  const { perspective, freq } = model
  const items = []
  items.push({
    span: 24,
    props: {
      label: '分析视角', prop: 'perspective',
      rules: [
        { required: true, message: '请选择分析视角', trigger: 'blur' }
      ]
    },
    items: buildFormItemsByDicts('a5e_perspective', 'el-radio', 'perspective', { linkage: true })
  })
  items.push({ tag: 'el-new-row' })
  items.push({
    props: {
      label: '统计频度', prop: 'freq',
      rules: [
        { required: true, message: '请选择统计频度', trigger: 'blur' }
      ]
    },
    items: [
      { tag: 'el-select', name: 'freq', linkage: true, items: buildFormItemsByDicts('c12s_freq', 'el-option') }
    ]
  })
  if (isNotEmpty(freq)) {
    let type = ''
    if (freq === 'Y') {
      type = 'year'
    } else if (freq === 'M') {
      type = 'month'
    } else if (freq === 'D') {
      type = 'date'
    }
    items.push({
      props: {
        label: '频度日期', prop: 'freqDate',
        rules: [
          { required: true, message: '请选择频度日期', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-date-picker', name: 'freqDate', props: { type }
        }
      ]
    })
  }
  items.push({ tag: 'el-new-row' })
  if (perspective === 'GLOBAL') {
    // -
  } else if (perspective === 'SERVER') {
    items.push({
      props: {
        label: '服务编号', prop: 'serverId',
        rules: [
          { required: true, message: '请输入服务编号', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-autocomplete-wrap', name: 'serverId', linkage: true,
          props: {
            placeholder: '服务编号 / 标题 ...', 'value-key': 'id', 'trigger-on-focus': false,
            'fetch-suggestions': function(queryString, callback) {
              serverList({ idOrTitle: queryString }).then(response => {
                if (passable(response)) {
                  callback(response.data.items)
                }
              })
            },
            template: [
              { tag: 'div', style: '', prop: 'id' },
              { tag: 'div', style: 'line-height: 18px; font-size: 12px; color: #b4b4b4; padding-left: 14px', prop: 'title' }
            ]
          },
          events: {
            select: function(server) {
              model.serverId = server.id
              model.serverTitle = server.title
              vm.handleInput(model)
            }
          }
        }
      ]
    })
  } else if (perspective === 'CUSTOMER') {
    items.push({
      props: {
        label: '客户号', prop: 'customerId',
        rules: [
          { required: true, message: '请输入客户号', trigger: 'blur' }
        ]
      },
      items: [
        {
          tag: 'el-autocomplete-wrap', name: 'customerId', linkage: true,
          props: {
            placeholder: '上级客户号 / 名称 ...', 'value-key': 'id', 'trigger-on-focus': false,
            'fetch-suggestions': function(queryString, callback) {
              customerList({ idOrName: queryString }).then(response => {
                if (passable(response)) {
                  callback(response.data.items)
                }
              })
            },
            template: [
              { tag: 'div', style: '', prop: 'id' },
              { tag: 'div', style: 'line-height: 18px; font-size: 12px; color: #b4b4b4; padding-left: 14px', prop: 'name' }
            ]
          },
          events: {
            select: function(customer) {
              model.customerId = customer.id
              model.customerName = customer.name
              vm.handleInput(model)
            }
          }
        }
      ]
    })
  }
  return items
}

function checkCallStatisticsLog(vm, scopeMeta) {
  vm.ref().validateForm().then(valid => {
    if (valid) {
      const { freq, freqDate } = vm.getModel()
      vm.ref('CheckCallStatisticsLog').showDialog({ freq, freqDate })
    }
  })
}

function doAnalyzeRequest(vm, scopeMeta) {
  vm.ref().validateForm().then(valid => {
    if (valid) {
      const { perspective, freq, freqDate, serverId, serverTitle, customerId, customerName } = vm.getModel()
      if (perspective === 'GLOBAL') {
        vm.ref('GlobalPerspective').showDialog({ freq, freqDate })
      } else if (perspective === 'SERVER') {
        vm.ref('ServerPerspective').showDialog({ freq, freqDate, serverId, serverTitle })
      } else if (perspective === 'CUSTOMER') {
        vm.ref('CustomerPerspective').showDialog({ freq, freqDate, customerId, customerName })
      }
    }
  })
}

const SM_AnalyzeRequest = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'CheckCallStatisticsLog', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'CheckCallStatisticsLog' }
      })
      components.push({
        name: 'GlobalPerspective', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'GlobalPerspective' }
      })
      components.push({
        name: 'ServerPerspective', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'ServerPerspective' }
      })
      components.push({
        name: 'CustomerPerspective', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'CustomerPerspective' }
      })
      return components
    },
    formTitle: function(vm, scopeMeta) {
      return '分析测算'
    },
    controller: function(vm, scopeMeta) {
      const items = []
      items.push({
        text: '检查访问统计', props: { icon: 'el-icon-antd-alert', type: 'warning' },
        events: {
          click: () => checkCallStatisticsLog(vm, scopeMeta)
        }
      })
      items.push({
        float: 'right', text: '提交申请', props: { icon: 'el-icon-antd-check', type: 'primary' },
        events: {
          click: () => doAnalyzeRequest(vm, scopeMeta)
        }
      })
      return { items }
    },
    handleModel: function(vm, scopeMeta) {
      return (operate, model) => {
        const { freq, freqDate } = model
        if (
          (freq === 'Y' && freqDate && freqDate.length !== 4) ||
          (freq === 'M' && freqDate && freqDate.length !== 7) ||
          (freq === 'D' && freqDate && freqDate.length !== 10)
        ) {
          model.freqDate = ''
        }
        return model
      }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        return getAnalyzeFormItems(vm, scopeMeta, operate, model)
      }
    }
  }
}

function getCallStatisticsLogTableItems(vm, scopeMeta) {
  const { getDictTitle } = vm.$store.getters
  const items = []
  items.push({
    props: {
      label: '统计频度', prop: 'freq', fixed: 'left', width: '100',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('c12s_freq', cellValue)
      }
    }
  })
  items.push({
    props: { label: '频度日期', prop: 'freqDate', fixed: 'left', width: '100' }
  })
  items.push({
    props: {
      label: '状态', prop: 'status', width: '100',
      formatter: function(row, column, cellValue, index) {
        const title = getDictTitle('c15g_status', cellValue)
        if (cellValue === 'PART') {
          return buildTableActions(vm, [
            { title, type: 'warning', click: () => showMessage({ content: row.statusDescr, title: '状态说明', force: true }) }
          ])
        } else if (cellValue === 'FAIL') {
          return buildTableActions(vm, [
            { title, type: 'danger', click: () => showMessage({ content: row.statusDescr, title: '状态说明', force: true }) }
          ])
        } else {
          return title
        }
      }
    }
  })
  items.push({
    props: {
      label: '预警', prop: 'warnStatus', width: '100',
      formatter: function(row, column, cellValue, index) {
        let type = 'success'
        if (cellValue === 'FAIL') {
          type = 'danger'
        }
        return buildTableActions(vm, [
          { icon: 'el-icon-antd-bulb', type }
        ])
      }
    }
  })
  items.push({
    props: { label: '创建时间', prop: 'creationTime', width: '175' }
  })
  items.push({
    props: { prop: 'fill' }
  })
  return items
}

function doCallStatistics(vm, freq, freqDate, status) {
  let title = '重新统计'
  if (status === 'NONE') {
    title = '统计'
  }
  showConfirm({ content: `是否${title}访问日志 ？`, type: 'warning' }).then(() => {
    callLogStatistics(freq, freqDate).then(response => {
      if (passable(response)) {
        vm.refresh()
      }
    })
  }).catch(() => {})
}

function doAllCallStatistics(vm, scopeMeta) {
  const { freq, freqDate } = vm.extraParams
  let title = ''
  if (freq === 'Y') {
    title += ` ${freqDate} 年度`
  } else if (freq === 'M') {
    title += ` ${freqDate} 月度`
  } else if (freq === 'D') {
    title += ` ${freqDate} 日`
  }
  showConfirm({ content: `是否统计 ${title} 访问日志 ？`, type: 'warning' }).then(() => {
    const loading = showLoading(vm)
    callLogStatisticsAll(freq, freqDate).then(response => {
      loading.close()
      if (passable(response)) {
        vm.refresh()
      }
    })
  }).catch(() => {})
}

const SM_CheckCallStatisticsLog = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '访问统计日志'
    },
    controller: function(vm, scopeMeta) {
      const items = []
      items.push({
        text: '统计', props: { icon: 'el-icon-antd-dashboard', type: 'primary' },
        events: {
          click: () => doAllCallStatistics(vm, scopeMeta)
        }
      })
      return { items }
    },
    table: function(vm, scopeMeta) {
      const items = getCallStatisticsLogTableItems(vm, scopeMeta)
      items.push({
        props: {
          label: '操作', prop: 'action', fixed: 'right', width: '100',
          formatter: function(row, column, cellValue, index) {
            const { freq, freqDate, status } = row
            let title = '重新统计'
            if (status === 'NONE') {
              title = '统计'
            }
            const actions = []
            actions.push({ title, click: () => doCallStatistics(vm, freq, freqDate, status) })
            return buildTableActions(vm, actions)
          }
        }
      })
      return {
        props: {
          'row-key': 'id',
          lazy: true,
          load: (row, treeNode, resolve) => {
            const { freq, freqDate } = row
            let subFreq = ''
            if (freq === 'Y') {
              subFreq = 'M'
            } else if (freq === 'M') {
              subFreq = 'D'
            }
            if (isNotEmpty(subFreq)) {
              callStatisticsLogList({ freq: subFreq, freqDate }).then(response => {
                if (passable(response)) {
                  resolve(response.data.items)
                }
              })
            } else {
              resolve([])
            }
          }
        },
        items
      }
    },
    paginationMethod: function(vm, scopeMeta) {
      return callStatisticsLogList
    }
  }
}

function getPerspectiveSearcherItems(vm, scopeMeta, model) {
  const { routerName, scope } = scopeMeta
  const items = []
  if (routerName === 'SBS-Analyze') {
    if (scope === 'GlobalPerspective') {
      items.push({
        props: { label: '服务编号', prop: 'serverId' },
        items: [
          { tag: 'el-input', name: 'serverId' }
        ]
      })
    } else if (scope === 'ServerPerspective' || scope === 'CustomerPerspective') {
      // -
    }
    items.push({
      props: { label: '统计维度', prop: 'dimension' },
      items: [
        { tag: 'el-select', name: 'dimension', items: buildFormItemsByDicts('c5g_dimension', 'el-option') }
      ]
    })
  }
  return items
}

function getPerspectiveTableItems(vm, scopeMeta) {
  const { routerName, scope } = scopeMeta
  const { getDictTitle } = vm.$store.getters
  const items = []
  if (routerName === 'SBS-Analyze') {
    if (scope === 'GlobalPerspective') {
      items.push({
        props: {
          label: '服务编号', prop: 'serverId', fixed: 'left', width: '125',
          formatter: function(row, column, cellValue, index) {
            return buildTableActions(vm, [
              { title: cellValue, click: () => vm.ref('ServerView').showDialog({ id: cellValue }) }
            ])
          }
        }
      })
      items.push({
        props: {
          label: '服务套餐', prop: 'packageId', fixed: 'left', width: '325',
          formatter: function(row, column, cellValue, index) {
            return buildTableActions(vm, [
              { title: cellValue, click: () => vm.ref('ServicePackageView').showDialog({ id: cellValue }) }
            ])
          }
        }
      })
    } else if (scope === 'ServerPerspective') {
      items.push({
        props: {
          label: '客户号', prop: 'customerId', fixed: 'left', width: '125',
          formatter: function(row, column, cellValue, index) {
            return buildTableActions(vm, [
              { title: cellValue, click: () => vm.ref('CustomerView').showDialog({ id: cellValue }) }
            ])
          }
        }
      })
    } else if (scope === 'CustomerPerspective') {
      items.push({
        props: {
          label: '服务编号', prop: 'serverId', fixed: 'left', width: '125',
          formatter: function(row, column, cellValue, index) {
            return buildTableActions(vm, [
              { title: cellValue, click: () => vm.ref('ServerView').showDialog({ id: cellValue }) }
            ])
          }
        }
      })
      items.push({
        props: {
          label: '服务套餐', prop: 'packageId', fixed: 'left', width: '100',
          formatter: function(row, column, cellValue, index) {
            return buildTableActions(vm, [
              { icon: 'el-icon-antd-detail', click: () => vm.ref('ServicePackageView').showDialog({ id: cellValue }) }
            ])
          }
        }
      })
    }
  }
  items.push({
    props: {
      label: '统计维度', prop: 'dimension', width: '175',
      formatter: function(row, column, cellValue, index) {
        return getDictTitle('c5g_dimension', cellValue)
      }
    }
  })
  items.push({
    props: { label: '统计值', prop: 'count', width: '175' }
  })
  items.push({
    props: { prop: 'fill' }
  })
  return items
}

const SM_GlobalPerspective = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'ServerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServerView' }
      })
      components.push({
        name: 'ServicePackageView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServicePackageView' }
      })
      components.push({
        name: 'ServicePackageMeasureView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServicePackageMeasureView' }
      })
      components.push({
        name: 'CallStatisticsByCustomer', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'CallStatisticsByCustomer' }
      })
      return components
    },
    formTitle: function(vm, scopeMeta) {
      let title = ''
      const { freq, freqDate } = vm.extraParams
      if (freq === 'Y') {
        title += ` ${freqDate} 年度`
      } else if (freq === 'M') {
        title += ` ${freqDate} 月度`
      } else if (freq === 'D') {
        title += ` ${freqDate} 日`
      }
      title += '汇总'
      return title
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const items = getPerspectiveSearcherItems(vm, scopeMeta, model)
        return { items }
      }
    },
    table: function(vm, scopeMeta) {
      const { freq, freqDate } = vm.extraParams
      const items = getPerspectiveTableItems(vm, scopeMeta)
      items.push({
        props: {
          label: '操作', prop: 'action', fixed: 'right', width: '100',
          formatter: function(row, column, cellValue, index) {
            const { packageId, dimension, count } = row
            const actions = []
            actions.push({ title: '分布', click: () => vm.ref('CallStatisticsByCustomer').showDialog({ packageId, freq, freqDate, dimension }) })
            actions.push({ title: '测算', click: () => vm.ref('ServicePackageMeasureView').showDialog({ id: packageId, count }) })
            return buildTableActions(vm, actions)
          }
        }
      })
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return callStatisticsByGlobal
    }
  }
}

const SM_ServerPerspective = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'CustomerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'CustomerView' }
      })
      components.push({
        name: 'ServerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServerView' }
      })
      components.push({
        name: 'CallStatisticsByServer', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'CallStatisticsByServer' }
      })
      return components
    },
    formTitle: function(vm, scopeMeta) {
      const { freq, freqDate, serverId, serverTitle } = vm.extraParams
      let title = '服务 '
      if (isNotEmpty(serverTitle)) {
        title += `${serverTitle} [${serverId}]`
      } else {
        title += serverId
      }
      if (freq === 'Y') {
        title += ` ${freqDate} 年度`
      } else if (freq === 'M') {
        title += ` ${freqDate} 月度`
      } else if (freq === 'D') {
        title += ` ${freqDate} 日`
      }
      title += '汇总'
      return title
    },
    controller: function(vm, scopeMeta) {
      const { serverId } = vm.extraParams
      const items = []
      items.push({
        text: '服务信息', props: { icon: 'el-icon-antd-cloud-server' }, events: { click: () => vm.ref('ServerView').showDialog({ id: serverId }) }
      })
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const items = getPerspectiveSearcherItems(vm, scopeMeta, model)
        return { items }
      }
    },
    table: function(vm, scopeMeta) {
      const { freq, freqDate, serverId } = vm.extraParams
      const items = getPerspectiveTableItems(vm, scopeMeta)
      items.push({
        props: {
          label: '操作', prop: 'action', fixed: 'right', width: '100',
          formatter: function(row, column, cellValue, index) {
            const { customerId, dimension } = row
            const actions = []
            actions.push({ title: '分布', click: () => vm.ref('CallStatisticsByServer').showDialog({ customerId, serverId, freq, freqDate, dimension }) })
            return buildTableActions(vm, actions)
          }
        }
      })
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return callStatisticsByServer
    }
  }
}

const SM_CustomerPerspective = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'CustomerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'CustomerView' }
      })
      components.push({
        name: 'ServerView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServerView' }
      })
      components.push({
        name: 'ServicePackageView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServicePackageView' }
      })
      components.push({
        name: 'ServicePackageMeasureView', component: () => import(`@/components/Typography/Flow/ViewBasic`),
        props: { scope: 'ServicePackageMeasureView' }
      })
      components.push({
        name: 'CallStatisticsByCustomer', component: () => import(`@/components/Typography/Flow/DialogList`),
        props: { scope: 'CallStatisticsByCustomer' }
      })
      return components
    },
    formTitle: function(vm, scopeMeta) {
      const { freq, freqDate, customerId, customerName } = vm.extraParams
      let title = '客户 '
      if (isNotEmpty(customerName)) {
        title += `${customerName} [${customerId}]`
      } else {
        title += customerId
      }
      if (freq === 'Y') {
        title += ` ${freqDate} 年度`
      } else if (freq === 'M') {
        title += ` ${freqDate} 月度`
      } else if (freq === 'D') {
        title += ` ${freqDate} 日`
      }
      title += '汇总'
      return title
    },
    controller: function(vm, scopeMeta) {
      const { customerId } = vm.extraParams
      const items = []
      items.push({
        text: '客户信息', props: { icon: 'el-icon-antd-contacts' }, events: { click: () => vm.ref('CustomerView').showDialog({ id: customerId }) }
      })
      return { items }
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        const items = getPerspectiveSearcherItems(vm, scopeMeta, model)
        return { items }
      }
    },
    table: function(vm, scopeMeta) {
      const { freq, freqDate } = vm.extraParams
      const items = getPerspectiveTableItems(vm, scopeMeta)
      items.push({
        props: {
          label: '操作', prop: 'action', fixed: 'right', width: '100',
          formatter: function(row, column, cellValue, index) {
            const { packageId, dimension, count } = row
            const actions = []
            actions.push({ title: '分布', click: () => vm.ref('CallStatisticsByCustomer').showDialog({ packageId, freq, freqDate, dimension }) })
            actions.push({ title: '测算', click: () => vm.ref('ServicePackageMeasureView').showDialog({ id: packageId, count }) })
            return buildTableActions(vm, actions)
          }
        }
      })
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return callStatisticsByCustomer
    }
  }
}

export default parallel([
]).then(() => {
}).then(() => {
  return [
    {
      id: 'flow_sbs_core',
      title: '市舶司流程',
      descr: '市舶司流程',
      pages: [
        {
          routerName: 'SBS-Server',
          title: '服务信息',
          descr: '服务信息',
          meta: {
            'SBS-Server': SM_ServerList(),
            'ServerThemeEdit': SM_ServerThemeEdit(),
            'ServerEdit': SM_ServerEdit()
          }
        },
        {
          routerName: 'SBS-ServicePackageTemplate',
          title: '服务套餐模板',
          descr: '服务套餐模板',
          meta: {
            'SBS-ServicePackageTemplate': SM_ServicePackageList(),
            'ServicePackageTemplateEdit': SM_ServicePackageEdit(),
            'ServicePackageMeasureView': SM_ServicePackageMeasureView()
          }
        },
        {
          routerName: 'SBS-Customer',
          title: '客户信息',
          descr: '客户信息',
          meta: {
            'SBS-Customer': SM_CustomerList(),
            'CustomerEdit': SM_CustomerEdit(),
            'ServicePackageList': SM_ServicePackageList(),
            'ServicePackageEdit': SM_ServicePackageEdit(),
            'ServicePackageTemplateSelect': SM_ServicePackageList(),
            'ServicePackageTemplateView': SM_ServicePackageView(),
            'ServicePackageMeasureView': SM_ServicePackageMeasureView()
          }
        },
        {
          routerName: 'SBS-CallStatistics',
          title: '访问统计',
          descr: '访问统计',
          meta: {
            'SBS-CallStatistics': SM_CallStatisticsList(),
            'CustomerView': SM_CustomerView(),
            'ServerView': SM_ServerView(),
            'ServicePackageView': SM_ServicePackageView()
          }
        },
        {
          routerName: 'SBS-LogDetail',
          title: '日志明细',
          descr: '日志明细',
          meta: {
            'SBS-LogDetail': SM_CallLogList(),
            'CustomerView': SM_CustomerView(),
            'ServerView': SM_ServerView(),
            'ServicePackageView': SM_ServicePackageView()
          }
        },
        {
          routerName: 'SBS-Analyze',
          title: '分析测算',
          descr: '分析测算',
          meta: {
            'SBS-Analyze': SM_AnalyzeRequest(),
            'CheckCallStatisticsLog': SM_CheckCallStatisticsLog(),
            'GlobalPerspective': SM_GlobalPerspective(),
            'ServerPerspective': SM_ServerPerspective(),
            'CustomerPerspective': SM_CustomerPerspective(),
            'CustomerView': SM_CustomerView(),
            'ServerView': SM_ServerView(),
            'ServicePackageView': SM_ServicePackageView(),
            'ServicePackageMeasureView': SM_ServicePackageMeasureView(),
            'CallStatisticsByServer': SM_CallStatisticsList(),
            'CallStatisticsByCustomer': SM_CallStatisticsList()
          }
        }
      ]
    }
  ]
})
