<template>
  <el-card v-bind="props">
    <el-container>
      <el-container>
        <component v-for="(action, i) in actionPool.leftActions" :key="'cl' + i" :is="action.tag" :c-o-m="action" />
      </el-container>
      <component v-for="(action, i) in actionPool.rightActions" :key="'cr' + i" :is="action.tag" :c-o-m="action" />
    </el-container>
  </el-card>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import ElButtonWrap from '@/components/Typography/Wrap/elButtonWrap'
import ElDropdownWrap from '@/components/Typography/Wrap/elDropdownWrap'
import TyDivider from '@/components/Typography/Divider'

export default {
  name: 'TyTableController',
  components: { ElButtonWrap, ElDropdownWrap, TyDivider },
  props: {
    controller: {
      type: Object,
      default: function() {
        /*
        action 基于 ComponentObjectModel 扩展
          float: 按钮对齐位置 [left（默认） | right]
          divided: 是否添加分割线 [false（默认） | true]
        */
        return {}
      }
    }
  },
  computed: {
    props: function() {
      return {
        'body-style': { padding: '10px' },
        shadow: 'hover',
        ...this.controller.props
      }
    },
    actionPool() {
      const leftActions = []
      const rightActions = []
      if (isNotEmpty(this.controller.items)) {
        this.controller.items.forEach((action, index) => {
          const float = action.float
          const divided = action.divided
          const items = action.items
          let actions = null
          if (float === 'right') {
            actions = rightActions
          } else {
            actions = leftActions
          }
          if (divided === true) {
            actions.push({ tag: 'ty-divider' })
          } else {
            actions.push({
              tag: 'ty-divider',
              props: {
                line: 'none'
              }
            })
          }
          let tag = ''
          if (items && items.length) {
            tag = 'el-dropdown-wrap'
          } else {
            tag = 'el-button-wrap'
          }
          action.tag = tag
          actions.push(action)
        })
      }
      return { leftActions, rightActions }
    }
  }
}
</script>
