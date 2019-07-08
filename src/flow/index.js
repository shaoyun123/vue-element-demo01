/*
流程定义：
{
  id: 'flow_id', // [唯一]
  title: '流程标题',
  descr: '流程描述', // [可空]
  pages: [
    {
      routerName: '路由名', // 与路由定义中的名称保持一致 [唯一]
      title: '页面名称',
      descr: '页面描述', // [可空]
      'status-from': [{ field1: value, field2: value }], // [可空]
      'dict-mapping': { field1: 'dictName1', field2: { value: title }, // [可空]
      meta: { // 页面元信息
        // 作用域，作用域命名遵循以下约定
        // 主页面（组件）取 routerName，子页面（组件）取 componentName
        scope: {
          // 页面模板的不同元信息会发生相应变化
          // 所有元信息绑定方法 function(vm, scopeMeta)
          // vm 为当前 vue 对象，既 this
          // scopeMeta 指定作用域的元信息集合
          // 出来以下默认的元信息外，也可以自定义元信息
          components: return [
            // 需要引入的组件
            {
              name: '', // 组件名称，可以根据名称获取组件 ref [page.scope.唯一]
              component: () => import(`@/.../name`), // 组件
              props: {}, // 绑定参数
              events: {} // 绑定事件
            }
          ],
          flowActions: return [
            // 流转 action
            {
              code: '操作码',
              title: '操作标题',
              descr: '操作描述', // [可空]
              icon: '按钮图标', // [可空]
              type: '按钮类型', // [可空]
              'all-in': false, // 是否支持“全部”处理模式，此模式只在 list 类模板中有效 [默认值为 false]
              'status-flow': [
                {
                  'page-to': 'page.routerName',
                  'status-to': { field1: value, field2: value },
                  // 用于处理前台操作分支 [可空]
                  // 值为对象时：所有相同字段的值在其数组范围内则通过此条数据
                  // 值为函数时：将 flowActionData 或者 querier 传入
                  'status-filter': { field1: [value], field2: [value1, value2] } | function(data)
                }
              ],
              remark: false, // 是否需要填写备注信息 [默认值为 false]，remark 支持 Boolean 型或一个 formItem 数组，定义为一个数组时可以支持更复杂的备注信息
              click: function(data, flowRecord, allin) // 按钮点击执行方法
            }
          ],
          categoryController: return Object, // 分类页控制区、表单控制区
          categoryTree: return Object, // 分类树
          linkageMethod: return Function(data, node), // 分类页联动方法
          controller: return Object, // 列表页控制区、表单控制区
          searcher: return Object, // 列表页搜索表单
          table: return Object, // 列表页列表
          paginationMethod: return Function(querier), // 列表页列表获取远端数据方法
          dialog: return Object, // 对话框
          afterClose: return Function(data) // 对话框关闭动方法，在关闭后调用
          formTitle: return String, // 表单标题
          form: return Object, // 表单页表单
          defaultModel: return Object, // 表单页表单默认 model，对 form 的快速构建
          handleModel: return Function(operate, model), // 表单页表单捕获 model，对 form 的快速构建
          handleItems: return Function(operate, model), // 表单页表单默认 model，对 form 的快速构建
          getMethod: return Function(primaryKey), // 表单页表单初始化获取远端数据方法
          saveMethod: return Function(model), // 表单页数据保存方法
          beforeSave: return Function(operate, model), // 表单页数据保存方法联动方法，在保存前调用
          afterSave: return Function(operate, model) // 表单页数据保存方法联动方法，在保存后调用
        }
      }
    }
  ]
}

流程页面模板接口，所有流程页面模板都需要实现这些方法：
ref(componentName): return VueComponent // 获取当前页面中的组件引用 [参考 flow.ref]
getTemplateName(): return String // 获取当前流程页面模板名称
getFlowActionData(): return [] // 获取流程控制主体数据
refresh() // 刷新数据
*/

import router from '@/router'
import store from '@/store'
import { getDataType } from '@/utils'
import { parallel } from '@/utils/request'
import { isEmpty, isNotEmpty } from '@/utils/validate'
// import { asyncScript } from '@/utils/asyncFile'
import { showMessage, showConfirm, showPrompt } from '@/utils/element'
import manager from '@/flow/flow-manager'
import pitFlows from '@/flow/pit'
import fttFlows from '@/flow/ftt'

const flows = []
const flowStorer = {} // flowId 为 key
const pageStorer = {} // routerName 为 key
function push(container, moduleFlows) {
  if (getDataType(moduleFlows) === 'promise') {
    container.push(moduleFlows)
  } else {
    container.push(Promise.resolve(moduleFlows))
  }
}
function init() {
  const container = []
  // 引入 flow 开始
  push(container, pitFlows)
  push(container, fttFlows)
  // 引入 flow 结束
  // 远程引入 flow 开始
  /*
  远程 flow 可以在 [dev | prod].env.js 中为 REMOTE_FLOW_LODER 指定一个 URL
  URL 返回一个完整的 js 文件，要求 js 文件对外暴露 REMOTE_FLOWS 方法，返回 flow 数组
  const remoteFlowLoder = process.env.REMOTE_FLOW_LODER
  if (isNotEmpty(remoteFlowLoder)) {
    push(container, asyncScript({ url: remoteFlowLoder }).then(() => {
      /* eslint-disable /
      return REMOTE_FLOWS()
    }))
  }
  */
  // 远程引入 flow 结束
  parallel(container).then(responses => {
    if (isNotEmpty(responses)) {
      responses.forEach(data => {
        flows.push(...data)
      })
    }
  }).then(() => {
    // 放入工作流相关的 flow 开始
    flows.push(...manager.flows())
    // 放入工作流相关的 flow 结束
    if (isNotEmpty(flows)) {
      flows.forEach(flow => {
        const flowId = flow.id
        const pages = flow.pages
        flowStorer[flowId] = flow
        if (isNotEmpty(pages)) {
          pages.forEach(page => {
            const routerName = page.routerName
            page['flowId'] = flowId
            pageStorer[routerName] = page
          })
        }
      })
    }
    store.dispatch('changeInitializing')
  })
}
init()

function getFlow(flowId) {
  return flowStorer[flowId]
}

function getPage(routerName) {
  return pageStorer[routerName]
}

/**
 * 获取路由指定作用域的元信息
 * @param {String} routerName 路由名称（唯一）
 * @param {String} scope 作用域
 */
function getScopeMeta(routerName, scope) {
  let scopeMeta = {}
  const page = getPage(routerName)
  if (isNotEmpty(page)) {
    const flowId = page.flowId
    const meta = page.meta
    if (isNotEmpty(meta)) {
      scopeMeta = meta[scope] || {}
      scopeMeta['flowId'] = flowId
      scopeMeta['routerName'] = routerName
      scopeMeta['scope'] = scope
    }
  }
  return scopeMeta
}

/**
 * 获取页面元属性
 * @param {Object} vm 当前 vue 对象，既 this
 * @param {Object} scopeMeta 指定作用域的元信息集合
 * @param {String} entryName 元属性名称
 * @param defaultValue 元属性默认值 [可空] [默认值为 getMetaEntryDefaultValue(vm, entryName)]
 */
function getMetaEntry(vm, scopeMeta, entryName, defaultValue) {
  let entry = defaultValue || getMetaEntryDefaultValue(vm, entryName)
  const entryFunc = scopeMeta[entryName]
  if (isNotEmpty(entryFunc)) {
    entry = entryFunc(vm, scopeMeta)
  }
  // 处理各类 entry
  if (entryName === 'flowActions') {
    entry = buildFlowActions(vm, scopeMeta, entry)
  } else if (entryName === 'controller') {
    const flowActions = getMetaEntry(vm, scopeMeta, 'flowActions')
    if (isNotEmpty(flowActions)) {
      const items = entry.items
      if (isNotEmpty(items)) {
        entry.items = items.concat(flowActions)
      } else {
        entry.items = flowActions
      }
    }
  }
  return entry
}

/**
 * 获取页面元属性的默认值
 * @param {Object} vm 当前 vue 对象，既 this
 * @param {String} entryName 元属性名称
 */
function getMetaEntryDefaultValue(vm, entryName) {
  let defaultValue = {}
  if (entryName === 'components') {
    defaultValue = []
  } else if (entryName === 'flowActions') {
    defaultValue = []
  } else if (entryName === 'linkageMethod') {
    defaultValue = (data, node) => {
      return data
    }
  } else if (entryName === 'paginationMethod') {
    defaultValue = (querier) => {
      return Promise.resolve({
        data: { items: [], total: 0 }
      })
    }
  } else if (entryName === 'dialog') {
    defaultValue = {
      props: { title: '对话框' }
    }
  } else if (entryName === 'formTitle') {
    defaultValue = '表单'
  } else if (entryName === 'afterClose') {
    defaultValue = (data) => {
      vm.$emit('after-close', data)
    }
  } else if (entryName === 'handleModel') {
    defaultValue = (operate, model) => {
      return model
    }
  } else if (entryName === 'handleItems') {
    defaultValue = (operate, model) => {
      return []
    }
  } else if (entryName === 'getMethod') {
    defaultValue = (primaryKey) => {
      return Promise.resolve({
        data: {}
      })
    }
  } else if (entryName === 'saveMethod') {
    defaultValue = (model) => {}
  } else if (entryName === 'beforeSave') {
    defaultValue = (operate, model) => {
      return true
    }
  } else if (entryName === 'afterSave') {
    defaultValue = (operate, model) => {
      vm.$emit('after-save', model)
    }
  }
  return defaultValue
}

/**
 * 构建流程按钮
 * @param {Object} vm 当前 vue 对象，既 this
 * @param {Object} scopeMeta 指定作用域的元信息集合
 * @param {Array} flowActions 流程控制 action
 */
function buildFlowActions(vm, scopeMeta, flowActions) {
  const buttons = []
  const templateName = vm.getTemplateName()
  flowActions.forEach((action) => {
    const title = action.title
    const descr = action.descr
    const icon = action.icon
    const type = action.type
    let allin = action['all-in']
    const remark = action.remark
    const button = { float: 'right', text: title }
    const props = {}
    const events = {}
    if (templateName === 'EditBasic' || templateName === 'EditPlane') {
      allin = undefined
    }
    if (isNotEmpty(descr)) {
      button.tip = descr
    }
    if (allin !== true) {
      button.selectedRowVisible = true
    }
    if (isNotEmpty(icon)) {
      props.icon = icon
    }
    if (isNotEmpty(type)) {
      props.type = type
    }
    if (getDataType(remark) === 'array') {
      console.log('remark:array')
    } else if (remark === true) {
      events.click = function() {
        const datas = vm.getFlowActionData()
        if (isNotEmpty(datas)) {
          showPrompt({ content: `请输入${title}原因`, title }).then(({ value }) => {
            clickFlowAction(vm, scopeMeta, action, datas, false, value)
          }).catch(() => {})
        } else if (allin === true) {
          showPrompt({ content: `请输入${title}原因`, title: `全部${title}` }).then(({ value }) => {
            const querier = ref(vm).getQuerier()
            clickFlowAction(vm, scopeMeta, action, querier, true, value)
          }).catch(() => {})
        } else {
          showMessage({ content: '未获取到待流转数据 ！', type: 'warning' })
        }
      }
    } else {
      events.click = function() {
        const datas = vm.getFlowActionData()
        if (isNotEmpty(datas)) {
          showConfirm({ content: `是否${title}数据 ？`, type: 'warning' }).then(() => {
            clickFlowAction(vm, scopeMeta, action, datas, false, null)
          }).catch(() => {})
        } else if (allin === true) {
          showConfirm({ content: `是否${title}全部数据 ？`, type: 'warning' }).then(() => {
            const querier = ref(vm).getQuerier()
            clickFlowAction(vm, scopeMeta, action, querier, true, null)
          }).catch(() => {})
        } else {
          showMessage({ content: '未获取到待流转数据 ！', type: 'warning' })
        }
      }
    }
    button.props = props
    button.events = events
    buttons.push(button)
  })
  return buttons
}

/**
 * 构建触发 FlowAction 函数主体
 * @param {Object} vm 当前 vue 对象，既 this
 * @param {Object} scopeMeta 指定作用域的元信息集合
 * @param {Object} action 流程控制 action
 * @param {Object | Array} data 数据
 * @param {Boolean} allin 执行全部处理
 * @param {String | Object} remark 备注信息
 */
function clickFlowAction(vm, scopeMeta, action, data, allin, remark) {
  const { getDictTitle } = vm.$store.getters
  const statusFlow = action['status-flow']
  if (isNotEmpty(statusFlow)) {
    const routerName = scopeMeta.routerName
    const page = getPage(routerName)
    const dictMapping = page['dict-mapping'] || {}
    const code = action.code
    const title = action.title
    const click = action.click
    statusFlow.forEach(sf => {
      const pageTo = sf['page-to']
      const statusTo = sf['status-to']
      const statusFilter = sf['status-filter']
      let processableData = null
      if (isNotEmpty(statusFilter)) {
        if (getDataType(statusFilter) === 'function') {
          processableData = statusFilter(data)
        } else {
          if (allin === true) {
            processableData = Object.assign({}, data, statusFilter)
          } else {
            processableData = []
            const filterResult = {}
            const fields = Object.keys(statusFilter)
            data.forEach(d => {
              let addable = true
              for (let i = 0; i < fields.length; i++) {
                const field = fields[i]
                const checker = statusFilter[field]
                const value = d[field]
                if (!checker.includes(value)) {
                  addable = false
                  const dict = dictMapping[field]
                  let dictTitle = ''
                  if (getDataType(dict) === 'string') {
                    dictTitle = getDictTitle(dict, value)
                  } else {
                    dictTitle = dict[value]
                  }
                  let message = value
                  if (isNotEmpty(dictTitle) && dictTitle !== value) {
                    message = `${dictTitle} [${value}]`
                  }
                  filterResult[message] = (filterResult[message] || 0) + 1
                  return
                }
              }
              if (addable === true) {
                processableData.push(d)
              }
            })
            if (isNotEmpty(filterResult)) {
              let filterMesage = ''
              const messages = Object.keys(filterResult)
              messages.forEach((message, i) => {
                const count = filterResult[message]
                if (i > 0) {
                  filterMesage += '<br />'
                }
                filterMesage += `有 ${count} 条 ${message} 数据不能执行 ${title} 操作，系统自动剔除`
              })
              showMessage({ content: filterMesage, type: 'warning' })
            }
          }
        }
      } else {
        processableData = data
      }
      const flowRecord = buildFlowRecord(scopeMeta, code, title, pageTo, statusTo, remark)
      click(processableData, flowRecord, allin)
    })
  } else {
    showMessage({ content: '未定义状态流转信息 ！', type: 'warning' })
  }
}

/**
 * 构建流程流转记录
 * @param {Object} scopeMeta 指定作用域的元信息集合
 * @param {String} operateCode 操作码
 * @param {String} operateTitle 操作标题
 * @param {Object} pageTo 页面流转到
 * @param {Object} statusTo 状态流转到
 * @param {Object} remark 流转备注
 * @return { flowId, routerName, scope, operateCode, operateTitle, 'page-to', 'status-to', remark }
 */
function buildFlowRecord(scopeMeta, operateCode, operateTitle, pageTo, statusTo, remark) {
  const { flowId, routerName, scope } = scopeMeta
  const flowRecord = { flowId, routerName, scope, operateCode, operateTitle, 'page-to': pageTo, 'status-to': statusTo }
  if (isNotEmpty(remark)) {
    flowRecord.remark = remark
  }
  return flowRecord
}

/**
 * 获取页面组件引用
 * @param {Object} vm 当前 vue 对象，既 this
 * @param {String} componentName 组件名称，值为空则取页面主组件（主组件引用名默认为 ref） [可空]
 */
function ref(vm, componentName) {
  let ref = null
  if (isNotEmpty(componentName)) {
    ref = vm.$refs[`ref-${componentName}`]
  } else {
    ref = vm.$refs['ref']
  }
  if (isNotEmpty(ref) && getDataType(ref) === 'array') {
    ref = ref[0]
  }
  return ref
}

export default {
  getFlow: (flowId) => {
    return getFlow(flowId)
  },
  getFlows: () => {
    return flows
  },
  getPage: (routerName) => {
    return getPage(routerName)
  },
  getPages: (flowId) => {
    const flow = getFlow(flowId)
    if (isNotEmpty(flow)) {
      return flow.pages
    } else {
      return []
    }
  },
  /**
   * 获取路由指定作用域的元信息
   * @param {String} routerName 路由名称（唯一）
   * @param {String} scope 作用域
   */
  getScopeMeta: (routerName, scope) => {
    return getScopeMeta(routerName, scope)
  },
  /**
   * 获取页面元属性
   * @param {Object} vm 当前 vue 对象，既 this
   * @param {Object} scopeMeta 指定作用域的元信息集合
   * @param {String} entryName 元属性名称
   * @param defaultValue 元属性默认值 [可空] [默认值为 getMetaEntryDefaultValue(vm, entryName)]
   */
  getMetaEntry: (vm, scopeMeta, entryName, defaultValue) => {
    return getMetaEntry(vm, scopeMeta, entryName, defaultValue)
  },
  /**
   * 获取页面组件引用
   * @param {Object} vm 当前 vue 对象，既 this
   * @param {String} componentName 组件名称，值为空则取页面主组件（主组件引用名默认为 ref） [可空]
   */
  ref: (vm, componentName) => {
    return ref(vm, componentName)
  }
}

/**
 * 获取当前页面流程控制 Actions
 * 注意：页面需要实现 getFlowActionData() 接口
 * @param {Object} vm 当前 vue 对象，既 this
 * @param {String} scope 作用域 [可空] [默认值为 currentRoute.name]
 */
export const getFlowActions = (vm, scope) => {
  const currentRoute = router.currentRoute
  const routerName = currentRoute.name
  if (isEmpty(scope)) {
    scope = routerName
  }
  const scopeMeta = getScopeMeta(routerName, scope)
  return getMetaEntry(vm, scopeMeta, 'flowActions')
}
