<template>
  <el-autocomplete v-bind="$attrs" v-on="$listeners">
    <el-component-wrap v-for="(item, i) in slots" :key="getKey(item.COM, i)" :slot="item.slot" :c-o-m="item.COM" v-bind="item.COM.props" v-on="item.COM.events" />
    <template v-if="template && template.length" slot-scope="{ item }">
      <component v-for="(fragment, i) in template" :key="'fragment_' + i" :is="fragment.tag" :style="fragment.style">
        {{ fragmentTitle(fragment.prop, item) }}
      </component>
    </template>
  </el-autocomplete>
</template>

<script>
import * as validator from '@/utils/validate'
import ElComponentWrap from '@/components/Typography/Wrap/elComponentWrap'

export default {
  name: 'ElAutocompleteWrap',
  components: { ElComponentWrap },
  props: {
    slots: {
      type: Array,
      default: function() {
        /*
        {
          slot: 'prefix | suffix | prepend | append',
          COM: {}
        }
        */
        return []
      }
    },
    template: {
      type: Array,
      default: function() {
        /*
        {
          tag: '',
          style: '',
          prop: ''
        }
        */
        return []
      }
    }
  },
  computed: {
    props: function() {
      return this.COM.props
    },
    events: function() {
      return this.COM.events
    }
  },
  methods: {
    getKey(item, index) {
      const tag = item.tag
      const name = item.name
      let key = 'el-autocomplete-wrap-' + tag
      if (validator.isNotEmpty(name)) {
        key += ('-' + name)
      }
      key += index
      return key
    },
    fragmentTitle(prop, item) {
      let title = item[prop]
      if (validator.isEmpty(title)) {
        title = prop
      }
      return title
    }
  }
}
</script>
