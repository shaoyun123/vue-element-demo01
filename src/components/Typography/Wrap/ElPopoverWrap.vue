<template>
  <el-popover v-model="visible" v-bind="COM.props" v-on="COM.events">
    <el-component-wrap v-if="COM.slot" :c-o-m="COM.slot" @input="handleInput($event)" />
    <el-button-wrap slot="reference" :c-o-m="COM['slot-reference']" />
  </el-popover>
</template>

<script>
import ElComponentWrap from './ElComponentWrap'
import ElButtonWrap from './ElButtonWrap'

export default {
  name: 'ElPopoverWrap',
  components: { ElComponentWrap, ElButtonWrap },
  props: {
    COM: {
      type: Object,
      default: function() {
        /*
        基于 ComponentObjectModel 扩展
        'slot': 显示的内容
        'slot-reference': [参考 ElButtonWrap]
        */
        return {}
      }
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    toggleSubsystem: function(id) {
      if (this.subsystem !== id) {
        this.$store.dispatch('toggleSubsystem', id)
        this.visible = false
      }
    },
    handleInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>
.subsystem-box-button {
  padding: 0px 0px;
  font-size: 48px;
  color: #1f2d3d;
}
.subsystem-box-button:hover {
  color: #409EFF;
}
</style>
