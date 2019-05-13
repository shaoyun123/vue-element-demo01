<template>
  <el-dialog :visible.sync="visible" v-bind="dialogProps" v-on="dialogEvents">
    <el-scrollbar :style="scrollbarStyle" class="scroll-container">
      <el-form-wrap ref="ref" :c-o-m="form" :reset-to="form.resetTo" :loading="loading" @input="handleFormInput($event)" />
    </el-scrollbar>
    <ty-button-controller v-if="payloadController.items.length" :controller="payloadController" />
  </el-dialog>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import ElFormWrap from '@/components/Typography/Wrap/ElFormWrap'
import TyButtonController from '@/components/Typography/Button/Controller'

export default {
  name: 'TyFormBasic',
  components: { ElFormWrap, TyButtonController },
  props: {
    dialog: {
      type: Object,
      default: function() {
        return {}
      }
    },
    form: {
      type: Object,
      default: function() {
        /*
        form 基于 ComponentObjectModel 扩展
          resetTo: 将表单表单重置到指定 model
        */
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    controller: {
      type: Object,
      default: function() {
        /*
        items 基于 ComponentObjectModel 扩展
          showReset: 是否显示重置按钮，默认为 true
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
  computed: {
    dialogProps: function() {
      return {
        width: '75%',
        top: '100px',
        'append-to-body': true,
        ...this.dialog.props
      }
    },
    dialogEvents: function() {
      return this.dialog.events
    },
    payloadController: function() {
      const self = this
      const items = []
      if (isNotEmpty(self.controller.items)) {
        items.push(...self.controller.items)
      }
      let showReset = self.controller.showReset
      if (showReset === undefined) {
        showReset = true
      }
      if (showReset) {
        items.push({
          float: 'right',
          text: '重  置',
          props: { icon: 'el-icon-antd-undo' },
          events: { click: self.resetForm }
        })
      }
      return {
        ...self.controller,
        items
      }
    },
    scrollbarStyle: function() {
      // [top 100] + [header 54] + [bodypadding 60] + [controller 54] + [bottom 100]
      const height = this.$store.getters.deviceSize.height - 368 + 'px'
      return { height }
    }
  },
  methods: {
    showDialog() {
      this.visible = true
      this.clearValidate()
    },
    hideDialog() {
      this.visible = false
    },
    handleFormInput(model) {
      this.$emit('input', model)
    },
    getModel() {
      let model = {}
      const ref = this.ref()
      if (isNotEmpty(ref)) {
        model = ref.getModel()
      }
      return model
    },
    clearValidate() {
      const ref = this.ref()
      if (isNotEmpty(ref)) {
        ref.clearValidate()
      }
    },
    validateForm() {
      const ref = this.ref()
      if (isNotEmpty(ref)) {
        return ref.validateForm()
      } else {
        return false
      }
    },
    clearForm() {
      const ref = this.ref()
      if (isNotEmpty(ref)) {
        ref.clearForm()
      }
    },
    resetForm() {
      this.$confirm('是否重置表单 ？', {
        type: 'warning',
        confirmButtonClass: 'el-icon-antd-check',
        confirmButtonText: '是',
        showCancelButton: false
      }).then(() => {
        this.ref().resetForm()
      }).catch(() => {})
    },
    ref() {
      return this.$refs.ref
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  padding-bottom: 2px;
  /deep/ {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-scrollbar__view {
      overflow-x: hidden;
    }
  }
}
</style>
