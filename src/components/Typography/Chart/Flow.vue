<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import { redirectTo } from '@/router'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import flowKit from '@/flow'
import { getDataType, debounce } from '@/utils'
import { isNotEmpty } from '@/utils/validate'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      xIndex: 0,
      yIndex: 0,
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    buildNode(config) {
      // type [P 页面 | S 状态 | A 操作 | B 分支]
      const { name, value, title, type } = config
      const x = 150 * this.xIndex
      const y = 100 * this.yIndex
      let category = ''
      let symbol = ''
      let color = ''
      let labelPosition = 'top'
      let labelOffset = [0, -5]
      if (type === 'P') {
        category = '页面'
        symbol = 'rect' // 方形
        color = '#67C23A'
      } else if (type === 'S') {
        category = '状态'
        symbol = 'arrow' // 箭头
        color = '#F56C6C'
        labelPosition = 'bottom'
        labelOffset = [0, 0]
      } else if (type === 'A') {
        category = '操作'
        symbol = 'circle' // 圆形
        color = '#409EFF'
      } else if (type === 'B') {
        category = '分支'
        symbol = 'diamond' // 菱形
        color = '#E6A23C'
      }
      return {
        name, value, x, y, category, symbol, symbolSize: 20,
        itemStyle: {
          normal: { color, borderColor: '#fff', borderWidth: 1, shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' }
        },
        label: {
          normal: {
            show: true,
            position: labelPosition,
            offset: labelOffset,
            formatter: () => title
          }
        }
      }
    },
    buildLink(config) {
      // type [SL 状态线 | AS 操作（分支）开始 | AE 操作（分支）箭头结束]
      const { source, target, type } = config
      const lineStyle = { color: 'source' }
      let symbol = ['none', 'none']
      let symbolSize = [0, 0]
      if (type === 'SL') {
        lineStyle.type = 'dashed'
        lineStyle.curveness = 0.3
      } else if (type === 'AS') {
        //
      } else if (type === 'AE') {
        symbol = ['none', 'arrow']
        symbolSize = [0, 10]
      }
      return { source, target, lineStyle, symbol, symbolSize }
    },
    buildFieldTitle(field, value, dictMapping) {
      const { getDictTitle } = this.$store.getters
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
    },
    buildDatas(datas) {
      /*
      [
        {
          id, title, 'status-from', 'dict-mapping',
          flowActions: [
            {
              id, title,
              'status-flow': [{ 'page-to', 'status-to' }]
            }
          ]
        }
      ]
      */
      const self = this
      const nodes = []
      const links = []
      if (isNotEmpty(datas)) {
        self.xIndex = 0
        self.yIndex = 0
        datas.forEach(data => {
          self.xIndex++
          self.yIndex = 1
          const pageId = data.id
          const page = flowKit.getPage(pageId)
          const pageTitle = data.title
          const statusFrom = data['status-from']
          const dictMapping = page['dict-mapping'] || {}
          const flowActions = data.flowActions
          nodes.push(self.buildNode({ name: pageId, value: pageId, title: pageTitle, type: 'P' }))
          if (isNotEmpty(statusFrom)) {
            self.yIndex = 1
            statusFrom.forEach(sf => {
              self.yIndex++
              const key = JSON.stringify(sf)
              const keyStatus = `STATUS_${pageId}_${key}`
              let titleStatus = ''
              const fields = Object.keys(sf)
              if (isNotEmpty(fields)) {
                fields.forEach((field, i) => {
                  const value = sf[field]
                  const fieldTitle = this.buildFieldTitle(field, value, dictMapping)
                  if (i > 0) {
                    titleStatus += ', '
                  }
                  titleStatus += `${field}: ${fieldTitle}`
                })
              }
              nodes.push(self.buildNode({ name: keyStatus, value: keyStatus, title: titleStatus, type: 'S' }))
              links.push(self.buildLink({ source: keyStatus, target: pageId, type: 'SL' }))
            })
          }
          if (isNotEmpty(flowActions)) {
            self.xIndex++
            self.yIndex = 0
            flowActions.forEach(item => {
              self.yIndex++
              const actionId = item.id
              const actionTitle = item.title
              const statusFlow = item['status-flow']
              if (isNotEmpty(statusFlow)) {
                const keyAction = `ACTION_${pageId}_${actionId}`
                if (statusFlow.length === 1) {
                  nodes.push(self.buildNode({ name: keyAction, value: keyAction, title: actionTitle, type: 'A' }))
                } else {
                  nodes.push(self.buildNode({ name: keyAction, value: keyAction, title: actionTitle, type: 'B' }))
                }
                links.push(self.buildLink({ source: pageId, target: keyAction, type: 'AS' }))
                statusFlow.forEach(sf => {
                  const pageTo = sf['page-to'] || pageId
                  const statusTo = sf['status-to']
                  if (isNotEmpty(statusTo)) {
                    const key = JSON.stringify(statusTo)
                    const keyStatus = `STATUS_${pageTo}_${key}`
                    links.push(self.buildLink({ source: keyAction, target: keyStatus, type: 'AE' }))
                    const fields = Object.keys(statusTo)
                    if (fields.length > 1) {
                      fields.forEach(field => {
                        const keySubStatus = `STATUS_${pageTo}_${JSON.stringify({ [field]: statusTo[field] })}`
                        links.push(self.buildLink({ source: keyAction, target: keySubStatus, type: 'AE' }))
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
      return { nodes, links }
    },
    setOptions(datas) {
      const { nodes, links } = this.buildDatas(datas)
      this.chart.setOption({
        tooltip: { show: false },
        legend: [{
          data: ['页面', '状态', '操作', '分支']
        }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        textStyle: { color: '#000' },
        series: [
          {
            type: 'graph',
            layout: 'none',
            roam: true,
            focusNodeAdjacency: true,
            categories: [
              { name: '页面', itemStyle: { color: '#67C23A' }},
              { name: '状态', itemStyle: { color: '#F56C6C' }},
              { name: '操作', itemStyle: { color: '#409EFF' }},
              { name: '分支', itemStyle: { color: '#E6A23C' }}
            ],
            nodes,
            links
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
      this.chart.on('click', function(params) {
        redirectTo(params.value)
      })
    }
  }
}
</script>
