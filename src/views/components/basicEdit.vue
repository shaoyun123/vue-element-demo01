<template>
  <typography-form-basic
    ref="ref"
    :dialog="dialog"
    :form="form"
    :loading="loading"
    :controller="controller"
    @input="handleDialogInput($event)" />
</template>

<script>
import { getDataType } from '@/utils'
import * as validator from '@/utils/validate'
import TypographyFormBasic from '@/components/Typography/Form/basic'

export default {
  name: 'BasicEdit',
  components: { TypographyFormBasic },
  props: {
    dialogTitle: {
      type: String,
      default: ''
    },
    defaultModel: {
      type: Object,
      default: function() {
        return {}
      }
    },
    getEntity: {
      type: Function,
      default: function() {}
    },
    saveEntity: {
      type: Function,
      default: function() {}
    },
    handleModel: {
      type: Function,
      default: function() {}
    },
    handleItems: {
      type: Function,
      default: function() {}
    },
    actions: {
      type: Array,
      default: function() {
        return []
      }
    },
    beforeSave: {
      type: Function,
      default: function() {}
    },
    afterSave: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      operate: 'add', // add edit
      adding: true,
      editing: false,
      items: [],
      model: {},
      resetTo: {},
      loading: false
    }
  },
  computed: {
    dialog: function() {
      return {
        props: {
          title: this.dialogTitle
        }
      }
    },
    form: function() {
      return {
        resetTo: this.resetTo,
        props: { model: this.model },
        items: this.items
      }
    },
    controller: function() {
      const self = this
      let items = []
      if (validator.isNotEmpty(this.actions)) {
        items = items.concat(this.actions)
      }
      items.push({
        float: 'right',
        text: '保  存',
        props: {
          icon: 'el-icon-antd-save',
          type: 'primary',
          plain: true
        },
        events: {
          click: self.save
        }
      })
      return { items }
    }
  },
  methods: {
    showDialog(primaryKey) {
      if (validator.isNotEmpty(primaryKey)) {
        this.operate = 'edit'
        this.adding = false
        this.editing = true
      } else {
        this.operate = 'add'
        this.adding = true
        this.editing = false
      }
      this.$refs['ref'].showDialog()
      this.init(primaryKey)
    },
    init(primaryKey) {
      this.loading = true
      if (this.adding) {
        this.model = this.defaultModel
        this.resetTo = this.defaultModel
        this.initItems()
        this.loading = false
      } else if (this.editing) {
        this.getEntity(primaryKey).then(response => {
          const model = response.data
          if (validator.isNotEmpty(model)) {
            this.model = model
            this.resetTo = model
          } else {
            const defaultModel = Object.assign({}, this.defaultModel, primaryKey)
            this.model = defaultModel
            this.resetTo = defaultModel
          }
          this.initItems()
          this.loading = false
        })
      }
    },
    initItems() {
      this.items = this.handleItems(this.operate, this.model)
    },
    save() {
      this.$refs['ref'].validateForm().then(valid => {
        if (valid) {
          let model = this.getModel()
          let beforeBool = this.beforeSave(this.operate, model)
          if (beforeBool === undefined) {
            beforeBool = true
          }
          if (beforeBool) {
            this.saveEntity(model).then(response => {
              model = response.data
              this.model = model
              this.resetTo = model
              this.$refs['ref'].hideDialog()
              this.afterSave(this.operate, model)
            })
          }
        }
      })
    },
    getModel() {
      return this.$refs['ref'].getModel()
    },
    handleDialogInput(model) {
      const self = this
      const modelWrap = self.handleModel(self.operate, model)
      if (getDataType(modelWrap) === 'promise') {
        modelWrap.then(function(data) {
          self.model = data
          self.initItems()
        })
      } else {
        self.model = modelWrap
        self.initItems()
      }
    }
  }
}
</script>
