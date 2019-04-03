<template>
  <span :class="className">{{ lineText }}</span>
</template>

<script>
export default {
  name: 'TyDivider',
  props: {
    COM: {
      type: Object,
      default: function() {
        return {}
      }
    },
    type: {
      /*
      水平还是垂直类型 [horizontal 水平 | vertical 垂直]
      */
      type: String,
      default: 'vertical'
    },
    line: {
      /*
      分割线类型 [solid 实线 | dashed 虚线 | none 无线]
      */
      type: String,
      default: 'solid'
    },
    text: {
      // 分割线标题
      type: String,
      default: ''
    },
    orientation: {
      /*
      分割线标题位置 [left | right | center]
      */
      type: String,
      default: 'left'
    }
  },
  computed: {
    className: function() {
      let type = this.type
      let line = this.line
      let orientation = this.orientation
      if (this.COM.props) {
        type = this.COM.props.type
        if (!type) {
          type = this.type
        }
        line = this.COM.props.line
        if (!line) {
          line = this.line
        }
        orientation = this.COM.props.orientation
        if (!orientation) {
          orientation = this.orientation
        }
      }
      return ['divider-' + type, 'divider-line-' + line, 'divider-text-' + orientation]
    },
    lineText: function() {
      let text = this.COM.text
      if (!text) {
        text = this.text
      }
      return text
    }
  }
}
</script>

<style scoped>
.divider-horizontal {
  height: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.divider-vertical {
  width: 1px;
  margin-left: 10px;
  margin-right: 10px;
}
.divider-line-solid {
  border: 0.5px solid rgb(235, 238, 245);
}
.divider-line-dashed {
  border: 0.5px dashed rgb(235, 238, 245);
}
.divider-line-none {
  margin-right: 0px;
  margin-bottom: 0px;
  border: 0.5px none rgb(235, 238, 245);
}
.divider-text-left {
  text-align: left
}
.divider-text-right {
  text-align: right
}
.divider-text-center {
  text-align: center
}
</style>
