<template>
  <el-table v-loading="loading" ref="ref" v-bind="props" v-on="events">
    <el-table-column v-for="item in items" :key="item.props.prop" v-bind="item.props" v-on="item.events" />
  </el-table>
</template>

<script>
import * as validator from '@/utils/validate'

export default {
  name: 'ElTableWrap',
  props: {
    COM: {
      type: Object,
      default: function() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    props: function() {
      return {
        stripe: true,
        border: true,
        fit: true,
        'highlight-current-row': true,
        style: 'width: 100%;',
        ...this.COM.props
      }
    },
    events: function() {
      return this.COM.events
    },
    items: function() {
      let addSelection = true
      let addIndex = true
      const items = []
      if (validator.isNotEmpty(this.COM.items)) {
        this.COM.items.forEach((item, index) => {
          const type = item.type
          if (type) {
            if (type === 'selection') {
              addSelection = false
            }
            if (type === 'index') {
              addIndex = false
            }
          }
          items.push(item)
        })
        if (addIndex) {
          items.unshift({
            props: { type: 'index', fixed: 'left', width: '50' }
          })
        }
        if (addSelection) {
          items.unshift({
            props: { type: 'selection', align: 'center', fixed: 'left', width: '50' }
          })
        }
      }
      return items
    }
  },
  methods: {
    ref() {
      return this.$refs.ref
    }
  }
}
</script>
