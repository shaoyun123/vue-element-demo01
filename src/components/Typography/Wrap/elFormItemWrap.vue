<template>
  <component
    :is="componentIs"
    v-bind="$attrs"
    v-on="$listeners">
    <span v-if="COM.text" v-text="COM.text" />
    <span v-if="COM.html" v-html="COM.html" />
    <el-form-item-wrap v-for="(item, i) in items" :key="getKey(item, i)" :c-o-m="item" v-bind="item.props" v-on="item.events" />
  </component>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import Richtext from '@/components/Tinymce'
import ElAutocompleteWrap from '@/components/Typography/Wrap/ElAutocompleteWrap'

export default {
  name: 'ElFormItemWrap',
  components: {
    Richtext,
    ElAutocompleteWrap
  },
  props: {
    COM: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    componentIs: function() {
      const tag = this.COM.tag
      if (isNotEmpty(tag)) {
        return tag
      } else {
        return this.COM.component
      }
    },
    items: function() {
      return this.COM.items
    }
  },
  methods: {
    getKey(item, index) {
      const tag = item.tag
      const name = item.name
      let key = this.COM.tag + '-' + tag
      if (isNotEmpty(name)) {
        key += ('-' + name)
      }
      key += index
      return key
    }
  }
}
</script>
