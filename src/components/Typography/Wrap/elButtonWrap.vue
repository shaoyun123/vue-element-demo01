<template>
  <el-tooltip v-if="COM.tip && COM.tip.length">
    <div slot="content"><span v-html="COM.tip" /></div>
    <el-button v-if="text && text.length" v-bind="props" v-on="events">{{ text }}</el-button>
    <el-button v-else v-bind="props" class="text-empty" v-on="events" />
  </el-tooltip>
  <el-button v-else-if="text && text.length" v-bind="props" v-on="events">{{ text }}</el-button>
  <el-button v-else v-bind="props" class="text-empty" v-on="events" />
</template>

<script>
export default {
  name: 'ElButtonWrap',
  props: {
    COM: {
      type: Object,
      default: function() {
        /*
        基于 ComponentObjectModel 扩展
          tip: '提示内容'，为按钮添加提示信息
        */
        return {}
      }
    }
  },
  computed: {
    text: function() {
      return this.COM.text
    },
    props: function() {
      let plain = true
      if (this.COM.props && this.COM.props.type === 'text') {
        plain = false
      }
      return {
        plain,
        ...this.COM.props
      }
    },
    events: function() {
      return this.COM.events
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.text-empty {
  padding: 10px;
  .el-button--medium {
    padding: 10px;
  }
}
</style>
