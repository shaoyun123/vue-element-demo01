<template>
  <div>
    <el-tree v-loading="loading" ref="ref" v-bind="props" v-on="events" />
    <el-dropdown
      v-if="visibleMenu()"
      ref="ref-menu"
      placement="bottom-start"
      trigger="click"
      @command="menuCommand">
      <span />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, i) in menu.items" :key="`mi_${i}`" v-bind="item.props">
          <span>{{ item.text }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { isEmpty, isNotEmpty } from '@/utils/validate'

export default {
  name: 'ElTableWrap',
  props: {
    COM: {
      type: Object,
      default: function() {
        /*
        基于 ComponentObjectModel 扩展
          menu: {
            command: function(command, data)
            items: [{el-dropdown-item}]
          }
        */
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {}
    }
  },
  computed: {
    /*
    el-tree 的 props 似乎有个很奇怪的特性
    更新 props 似乎不会生效，el-tree 依然使用之前的 props
    举例：
      页面初始化时未指定 props.props.label 既使用默认配置，取 data.label
      后续更新 props.props.label = function，刷新（doCreateChildren）节点，节点 label 不显示，猜测依然使用了初始化时的配置
    */
    props: function() {
      return {
        'highlight-current': true,
        'expand-on-click-node': false,
        'show-checkbox': true,
        ...this.COM.props
      }
    },
    events: function() {
      return {
        'node-contextmenu': this.nodeContextmenu,
        ...this.COM.events
      }
    },
    menu: function() {
      return this.COM.menu || {}
    }
  },
  methods: {
    visibleMenu() {
      if (isNotEmpty(this.menu.items)) {
        return true
      } else {
        return false
      }
    },
    nodeContextmenu(event, data, node, vm) {
      if (this.visibleMenu()) {
        this.data = data
        const ref = this.$refs[`ref-menu`]
        const style = ref.dropdownElm.style
        ref.hide()
        /*
        由于 show、hide 方法未提供回调函数，因此只能通过 setTimeout 进行处理
        show、hide 方法都属于 JS 内部计算，延迟较低，setTimeout 有一定可靠性
        */
        setTimeout(() => {
          ref.show()
          setTimeout(() => {
            style.top = `${event.y}px`
            style.left = `${event.x}px`
          }, 25)
        }, 100)
      }
    },
    menuCommand(command) {
      const call = this.menu.command
      if (isNotEmpty(call)) {
        call(command, this.data)
      }
    },
    reloadNode(parent) {
      /*
      刷新节点只需要处理 lazy 模式
      data 模式对节点的修改是对数据的直接修改，数据的变化会直接导致树的重新渲染
      */
      const { lazy, load } = this.props
      if (isNotEmpty(lazy) && isNotEmpty(load)) {
        const ref = this.ref()
        let node = parent
        if (isEmpty(node)) {
          // parent 为空则刷新整棵树
          node = ref.root
        }
        node.childNodes = []
        load(node, function(children) {
          node.doCreateChildren(children)
        })
        ref.setCurrentKey(null)
      }
    },
    ref() {
      return this.$refs.ref
    }
  }
}
</script>
