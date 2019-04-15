<template>
  <div>
    <component v-for="action in actions" :key="action.id" :is="action.tag" :c-o-m="action" />
  </div>
</template>

<script>
import router from '@/router'
import flow from '@/flow'
import { isNotEmpty } from '@/utils/validate'
import ElButtonWrap from '@/components/Typography/Wrap/elButtonWrap'

export default {
  name: 'TyFlowAction',
  components: { ElButtonWrap },
  props: {
    type: {
      /*
      按钮显示模式
      button 显示为按钮
      link 显示为链接
      icon 显示为图标，并以 tip 方式显示按钮标题
      */
      type: String,
      default: 'button'
    },
    group: {
      /*
      按钮组，可以在一个页面中定义多个组
      约定的内置组有：
      C（controller）控制区，如：表单下部的控制器、列表上部的控制器
      TA（table-action）列表操作区
      */
      type: String,
      default: 'C'
    }
  },
  computed: {
    actions: function() {
      const current = router.currentRoute
      const name = current.name
      const actions = flow.getActions(name)
      const buttons = []
      if (isNotEmpty(actions)) {
        actions.forEach(action => {
          const id = action.A_ID
          const title = action.A_TITLE
          const descr = action.A_DESCR
          const icon = action.A_ICON
          const showDescr = action.A_SHOW_DESCR
          const com = { tag: 'el-button-wrap', id }
          const props = {}
          const events = {
            click: function() {}
          }
          if (this.type === 'button') {
            if (isNotEmpty(title)) {
              com.text = title
            }
            if (isNotEmpty(icon)) {
              props.icon = icon
            }
          } else if (this.type === 'link') {
            if (isNotEmpty(title)) {
              com.text = title
            }
            props.type = 'text'
          } else if (this.type === 'icon') {
            if (showDescr && isNotEmpty(descr)) {
              com.tip = descr
            }
            if (isNotEmpty(icon)) {
              props.icon = icon
            }
            props.type = 'text'
          }
          com.props = props
          com.events = events
          buttons.push(com)
        })
      }
      return buttons
    }
  }
}
</script>
