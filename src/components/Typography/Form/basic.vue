<template>
  <el-dialog :visible.sync="dialogVisible" v-bind="dialogProps" v-on="dialogEvents">
    <el-scrollbar :style="scrollbarStyle" wrap-class="el-scrollbar-wrap" view-class="el-scrollbar-view">
      <el-form-wrap ref="ref-form" :c-o-m="form" :reset-to="form.resetTo" :loading="loading" @input="handleFormInput($event)" />
    </el-scrollbar>
    <ty-button-controller v-if="payloadController.items.length" :controller="payloadController" />
  </el-dialog>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import ElFormWrap from '@/components/Typography/Wrap/elFormWrap'
import TyButtonController from '@/components/Typography/Button/controller'

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
      dialogVisible: false
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
      const items = self.controller.items || []
      let showReset = self.controller.showReset
      if (showReset === undefined) {
        showReset = true
      }
      if (showReset) {
        items.push({
          float: 'right',
          text: '重  置',
          props: {
            icon: 'el-icon-antd-undo'
          },
          events: {
            click: self.resetForm
          }
        })
      }
      return {
        ...self.controller,
        items
      }
    },
    scrollbarStyle: function() {
      let height = 'auto'
      height = this.$store.getters.deviceSize.height - 368 + 'px' // [top 100] + [header 54] + [bodypadding 60] + [controller 54] + [bottom 100]
      return { height }
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
      this.clearValidate()
    },
    hideDialog() {
      this.dialogVisible = false
    },
    handleFormInput(model) {
      this.$emit('input', model)
    },
    getModel() {
      let model = {}
      const ref = this.$refs['ref-form']
      if (isNotEmpty(ref)) {
        model = ref.getModel()
      }
      return model
    },
    clearForm() {
      const refForm = this.$refs['ref-form']
      if (isNotEmpty(refForm)) {
        refForm.ref().resetFields()
      }
    },
    clearValidate() {
      const refForm = this.$refs['ref-form']
      if (isNotEmpty(refForm)) {
        refForm.ref().clearValidate()
      }
    },
    validateForm() {
      this.clearValidate()
      const refForm = this.$refs['ref-form']
      if (isNotEmpty(refForm)) {
        return refForm.ref().validate()
      } else {
        return false
      }
    },
    resetForm() {
      this.$confirm('是否重置表单 ？', {
        type: 'warning',
        confirmButtonClass: 'el-icon-antd-check',
        confirmButtonText: '是',
        showCancelButton: false
      }).then(() => {
        this.$refs['ref-form'].resetForm()
      }).catch(() => {})
    }
  }
}
</script>

<style>
.el-scrollbar-wrap {
  overflow-x: hidden;
}
.el-scrollbar-view {
  overflow-x: hidden;
}
</style>
