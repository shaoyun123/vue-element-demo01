<template>
  <el-main>
    <div class="controller">
      <ty-button-controller :controller="payloadController">
        <template slot="right">
          <ty-form-simple
            ref="ref-searcher"
            :reference="payloadSearcher.reference"
            :form="searcher.form"
            :controller="searcher.controller" />
          <ty-divider />
          <ty-button-status :value.sync="checkStrictly" tip=" 关闭节点级联勾选" size="mini" icon="el-icon-antd-branches" />
        </template>
      </ty-button-controller>
    </div>
    <el-scrollbar :style="scrollbarStyle" class="scroll-container">
      <el-tree-wrap ref="ref" :c-o-m="payloadTree" :loading="loading" />
    </el-scrollbar>
  </el-main>
</template>

<script>
import { getDataType } from '@/utils'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import TyButtonStatus from '@/components/Typography/Button/Status'
import TyDivider from '@/components/Typography/Divider'
import ElTreeWrap from '@/components/Typography/Wrap/ElTreeWrap'
import TyButtonController from '@/components/Typography/Button/Controller'
import TyFormSimple from '@/components/Typography/Form/Simple'

export default {
  name: 'TyTreeBasic',
  components: { TyButtonStatus, TyDivider, ElTreeWrap, TyButtonController, TyFormSimple },
  props: {
    controller: {
      type: Object,
      default: function() {
        /*
        action 基于 ComponentObjectModel 扩展
          selectedRowVisible: 是否选中数据行时显示按钮 [false（默认） | true]
        */
        return {}
      }
    },
    tree: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    const self = this
    return {
      queryString: '',
      searcher: {
        form: {
          props: {
            model: { queryString: '' }
          },
          items: [
            {
              span: 24,
              props: {
                prop: 'queryString',
                style: { 'margin-bottom': '0px' }
              },
              items: [
                {
                  tag: 'el-input', name: 'queryString',
                  items: [
                    {
                      tag: 'el-button', props: { slot: 'append', class: 'el-icon-antd-search' }, events: { click: self.filterNode }
                    }
                  ]
                }
              ]
            }
          ]
        },
        controller: { showReset: false }
      },
      checkStrictly: false,
      loading: false,
      checkedNodes: [],
      currentNode: {}
    }
  },
  computed: {
    payloadController: function() {
      const self = this
      const items = []
      if (isNotEmpty(self.controller.items)) {
        [...self.controller.items].forEach((item, index) => {
          let pushable = false
          if (item.selectedRowVisible) {
            if (isNotEmpty(self.checkedNodes)) {
              pushable = true
            }
          } else {
            pushable = true
          }
          if (pushable) {
            const text = item.text
            const tip = item.tip
            if (isNotEmpty(text) && isNotEmpty(tip)) {
              item.tip = `${text}<br />${tip}`
            } else if (isNotEmpty(text)) {
              item.tip = text
            }
            delete item.text
            items.push(item)
          }
        })
      }
      return {
        ...self.controller,
        items
      }
    },
    payloadSearcher: function() {
      /*
      检查是否有搜索条件
      检查到搜索条件后对按钮进行样式处理，提醒用户
      */
      let tip = '搜索器'
      let type = 'primary'
      if (isNotEmpty(this.queryString)) {
        tip = '点击查看已使用的搜索条件'
        type = 'success'
      }
      return {
        reference: {
          tip,
          props: { icon: 'el-icon-antd-search', type }
        }
      }
    },
    payloadTree: function() {
      const self = this
      const events = self.tree.events || {}
      const currentChange = events['current-change']
      return {
        menu: self.tree.menu,
        props: {
          'check-strictly': this.checkStrictly,
          'filter-node-method': self.filterNodeMethod,
          ...self.tree.props
        },
        events: {
          ...self.tree.events,
          'check': self.check,
          'current-change': (data, node) => {
            if (isNotEmpty(currentChange)) {
              currentChange(data, node)
            }
            self.currentChange(data, node)
          }
        }
      }
    },
    scrollbarStyle: function() {
      // [topbar 50] + [tagbar 33 + 1] + [mainpadding 40] + [searcher 54 + 10] + [容差 25]
      const height = this.$store.getters.deviceSize.height - 213 + 'px'
      return { height }
    }
  },
  methods: {
    reloadNode(parent) {
      const props = this.tree.props
      if (isNotEmpty(props)) {
        const { lazy, load } = props
        if (isNotEmpty(lazy) && isNotEmpty(load)) {
          this.ref().reloadNode(parent)
          this.checkedNodes = []
          this.currentNode = {}
        }
      }
    },
    filterNodeMethod(value, data, node) {
      if (isEmpty(value)) {
        return true
      }
      let title = ''
      const label = node.label
      if (getDataType(label) === 'function') {
        title = label(data, node)
      } else {
        title = label
      }
      return title.indexOf(value) !== -1
    },
    filterNode() {
      const { queryString } = this.$refs['ref-searcher'].getModel()
      this.queryString = queryString
      this.ref().ref().filter(queryString)
    },
    check(data, checked) {
      this.checkedNodes = checked.checkedNodes
    },
    currentChange(data, node) {
      this.currentNode = data
    },
    ref() {
      return this.$refs.ref
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.controller {
  margin-bottom: 10px;
}
.scroll-container {
  border: 1px solid #ebeef5;
  /deep/ {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-scrollbar__view {
      padding: 10px;
    }
  }
}
</style>
