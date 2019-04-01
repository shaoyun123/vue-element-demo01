<template>
  <component
    :is="COM.tag"
    v-bind="$attrs"
    v-on="$listeners">
    <span v-if="COM.text" v-text="COM.text" />
    <span v-if="COM.html" v-html="COM.html" />
    <el-component-wrap v-for="(item, i) in items" :key="getKey(item, i)" :c-o-m="item" v-bind="item.props" v-on="item.events" />
  </component>
</template>

<script>
import * as validator from '@/utils/validate'

export default {
  name: 'ElComponentWrap',
  props: {
    COM: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    items: function() {
      return this.COM.items
    }
  },
  methods: {
    getKey(item, index) {
      const tag = item.tag
      const name = item.name
      let key = this.COM.tag + '-' + tag
      if (validator.isNotEmpty(name)) {
        key += ('-' + name)
      }
      key += index
      return key
    }
  }
}
</script>
