<template>
  <el-dropdown v-waves v-bind="props" v-on="events">
    {{ text }}
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, i) in items" :key="i" v-bind="item.props">{{ item.text }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import waves from '@/directive/waves'

export default {
  name: 'ElDropdownWrap',
  directives: { waves },
  props: {
    COM: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    text: function() {
      return this.COM.text
    },
    props: function() {
      const events = this.COM.events
      const props = { ...this.COM.props }
      if (events && events.click) {
        props['split-button'] = true
      }
      return props
    },
    events: function() {
      return this.COM.events
    },
    items: function() {
      return this.COM.items
    }
  }
}
</script>
