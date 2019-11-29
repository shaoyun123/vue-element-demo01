import flow from '@/flow'
import { getDataType } from '@/utils'
import { isNotEmpty } from '@/utils/validate'
import { showMessage } from '@/utils/element'
import { buildTableActions } from '@/components/Typography/kit'

export const doPagination = (list, page, limit) => {
  if (page && page > 0 && limit && limit > 0) {
    const total = list.length
    const items = list.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return { total, items }
  } else {
    return { total: list.length, items: list }
  }
}

const flowList = (querier) => {
  const { id, title } = querier
  const list = flow.getFlows().filter(item => {
    if (!item) return false
    if (isNotEmpty(id) && item.id !== id) return false
    if (isNotEmpty(title) && item.title.indexOf(title) < 0) return false
    return true
  })
  return Promise.resolve({
    data: doPagination(list, 0, 0)
  })
}

const pageList = (querier) => {
  const { flowId, routerName, title, page = 1, limit = 20 } = querier
  const pages = flow.getPages(flowId)
  let list = []
  if (isNotEmpty(pages)) {
    list = pages.filter(item => {
      if (!item) return false
      if (isNotEmpty(routerName) && item.routerName.indexOf(routerName) < 0) return false
      if (isNotEmpty(title) && item.title.indexOf(title) < 0) return false
      return true
    })
  }
  return Promise.resolve({
    data: doPagination(list, page, limit)
  })
}

function buildFieldTitle(vm, field, value, dictMapping) {
  const { getDictTitle } = vm.$store.getters
  const dict = dictMapping[field]
  let dictTitle = value
  if (isNotEmpty(dict)) {
    if (getDataType(dict) === 'string') {
      dictTitle = getDictTitle(dict, value)
    } else {
      dictTitle = dict[value]
    }
    if (isNotEmpty(dictTitle) && dictTitle !== value) {
      dictTitle = `${dictTitle} [${value}]`
    }
  }
  return dictTitle
}

const SM_FlowManager = () => {
  return {
    components: function(vm, scopeMeta) {
      return [
        {
          name: 'FlowChart', component: () => import(`@/components/Typography/Flow/ViewBasic`),
          props: { scope: 'FlowChart' }
        }
      ]
    },
    categoryTree: function(vm, scopeMeta) {
      return {
        props: {
          'node-key': 'id',
          props: {
            label: 'title',
            isLeaf: function(data, node) {
              return true
            }
          },
          lazy: true,
          load: (node, resolve) => {
            flowList({}).then(response => {
              resolve(response.data.items)
            })
          }
        },
        menu: {
          command: (command, data) => {
            if (command === 'flow-detail') {
              const { id, title, descr = '-' } = data
              showMessage({ content: descr, title: `${title} [${id}]`, force: true })
            } else if (command === 'flow-chart') {
              vm.ref('FlowChart').showDialog(data)
            }
          },
          items: [
            {
              text: '明细', props: { command: 'flow-detail', icon: 'el-icon-antd-container' }
            },
            {
              text: '流程图', props: { command: 'flow-chart', icon: 'el-icon-antd-mr' }
            }
          ]
        }
      }
    },
    linkageMethod: function(vm, scopeMeta) {
      return (data, node) => {
        return { flowId: data.id }
      }
    },
    searcher: function(vm, scopeMeta) {
      return (model) => {
        return {
          items: [
            {
              props: { label: '路由名', prop: 'routerName' },
              items: [
                { tag: 'el-input', name: 'routerName' }
              ]
            },
            {
              props: { label: '标题', prop: 'title' },
              items: [
                { tag: 'el-input', name: 'title' }
              ]
            }
          ]
        }
      }
    },
    table: function(vm, scopeMeta) {
      const items = []
      items.push({
        props: { label: '路由名', prop: 'routerName', fixed: 'left', width: '150' }
      })
      items.push({
        props: {
          label: '标题', prop: 'title', fixed: 'left', width: '150',
          formatter: function(row, column, cellValue, index) {
            const contents = []
            const actions = buildTableActions(vm, [
              { icon: 'el-icon-antd-file-text', click: () => showMessage({ content: row.descr, title: '描述', force: true }) }
            ])
            contents.push(cellValue)
            contents.push(...actions)
            return contents
          }
        }
      })
      items.push({
        props: {
          label: 'From', prop: 'status-from', width: '500', 'show-overflow-tooltip': true,
          formatter: function(row, column, cellValue, index) {
            const { routerName } = row
            const page = flow.getPage(routerName)
            const dictMapping = page['dict-mapping'] || {}
            let fromDescr = ''
            if (isNotEmpty(cellValue)) {
              cellValue.forEach((cv, i) => {
                if (i > 0) {
                  fromDescr += ' , '
                }
                fromDescr += '{ '
                const fields = Object.keys(cv)
                fields.forEach((field, j) => {
                  if (j > 0) {
                    fromDescr += ', '
                  }
                  const value = cv[field]
                  const fieldTitle = buildFieldTitle(vm, field, value, dictMapping)
                  fromDescr += `${field}: ${fieldTitle}`
                })
                fromDescr += ' }'
              })
            }
            const h = vm.$createElement
            return h('span', {}, fromDescr)
          }
        }
      })
      items.push({
        props: {
          label: '流转', prop: 'flowActions', width: '500',
          formatter: function(row, column, cellValue, index) {
            const { flowId, routerName } = row
            const page = flow.getPage(routerName)
            const scopeMeta = page.meta && page.meta[routerName]
            const getFlowActions = scopeMeta && scopeMeta.flowActions
            const dictMapping = page['dict-mapping'] || {}
            const flowActions = []
            if (isNotEmpty(getFlowActions)) {
              getFlowActions(vm, { flowId, routerName, scope: routerName }).forEach(item => {
                const { code, title, descr, icon, remark } = item
                const allin = item['all-in']
                const statusFlow = item['status-flow']
                let flowDescr = ''
                if (isNotEmpty(statusFlow)) {
                  if (statusFlow.length === 1) {
                    flowDescr = '流转说明 :<br />'
                  } else {
                    flowDescr = '流转（分支）说明 :<br />'
                  }
                  statusFlow.forEach((sf, i) => {
                    if (i > 0) {
                      flowDescr += '<br />'
                    }
                    const pageTo = sf['page-to'] || '当前页面'
                    const statusTo = sf['status-to']
                    if (isNotEmpty(statusTo)) {
                      flowDescr += `>> ${pageTo}`
                      const fields = Object.keys(statusTo)
                      fields.forEach(field => {
                        const value = statusTo[field]
                        const fieldTitle = buildFieldTitle(vm, field, value, dictMapping)
                        flowDescr += `<br />>>>> ${field}: ${fieldTitle}`
                      })
                    }
                  })
                  flowDescr += '<br />'
                }
                const content = `
                  ${isNotEmpty(descr) ? `<p>${descr}</p><br />` : ''}
                  ${isNotEmpty(flowDescr) ? `<p>${flowDescr}</p><br />` : ''}
                  是否需要填写备注 : ${remark ? '是' : '否'}<br />
                  是否支持全部${title} : ${allin ? '是' : '否'}
                `
                flowActions.push({ title, icon, click: () => showMessage({ content, title: `${title} [${code}]`, force: true }) })
              })
            }
            return buildTableActions(vm, flowActions)
          }
        }
      })
      items.push({
        props: { prop: 'fill' }
      })
      return { items }
    },
    paginationMethod: function(vm, scopeMeta) {
      return pageList
    }
  }
}
const SM_FlowChart = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '流程图'
    },
    handleItems: function(vm, scopeMeta) {
      // [top 100] + [header 54] + [bodypadding 60] + [controller 54] + [itemBottom 22] + [容差 10] + [bottom 100]
      const height = vm.$store.getters.deviceSize.height - 400 + 'px'
      return (operate, model) => {
        const chartData = model.chartData
        return [
          {
            span: 24, props: { prop: 'FlowChart' },
            items: [
              {
                component: () => import(`@/components/Typography/Chart/Flow`), props: { height, chartData }
              }
            ]
          }
        ]
      }
    },
    getMethod: function(vm, scopeMeta) {
      return (primaryKey) => {
        const chartData = []
        const flowId = primaryKey.id
        const pages = (flow.getFlow(flowId) || {}).pages
        if (isNotEmpty(pages)) {
          pages.forEach(page => {
            const flowId = page.flowId
            const routerName = page.routerName
            const title = page.title
            const from = page['status-from']
            const scopeMeta = page.meta && page.meta[routerName]
            const getFlowActions = scopeMeta.flowActions
            const flowActions = []
            if (isNotEmpty(getFlowActions)) {
              getFlowActions(this, { flowId, routerName, scope: routerName }).forEach(item => {
                flowActions.push({ id: item.code, title: item.title, 'status-flow': item['status-flow'] })
              })
            }
            chartData.push({ id: routerName, title, 'status-from': from, flowActions })
          })
        }
        return Promise.resolve({
          data: { chartData }
        })
      }
    }
  }
}

export default {
  flows: () => {
    return [
      {
        id: 'flow_manager',
        title: '工作流',
        descr: '工作流',
        pages: [
          {
            routerName: 'SYS-FlowManager',
            title: '流程管理',
            descr: '流程管理',
            meta: {
              'SYS-FlowManager': SM_FlowManager(),
              'FlowChart': SM_FlowChart()
            }
          }
        ]
      }
    ]
  }
}
