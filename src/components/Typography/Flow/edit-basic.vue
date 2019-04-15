<template>
  <div>
    <ty-form-basic
      ref="ref"
      :dialog="dialog"
      :form="form"
      :loading="loading"
      :controller="controller"
      @input="handleDialogInput($event)" />
    <component
      v-for="item in components"
      :key="'sc_' + item.name"
      :ref="'ref-' + item.name"
      :is="item.component"
      v-bind="item.props"
      v-on="item.events" />
  </div>
</template>

<script>
import router from '@/router'
import flow from '@/flow'
import { getDataType } from '@/utils'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import TyFormBasic from '@/components/Typography/Form/basic'

export default {
  name: 'TyFlowEditBasic',
  components: { TyFormBasic },
  props: {
    scope: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      scopeMeta: {},
      components: [],
      operate: 'add', // add edit
      adding: true,
      editing: false,
      resetTo: {},
      model: {},
      items: [],
      loading: false
    }
  },
  computed: {
    dialog: function() {
      const title = flow.getMetaEntry(this, this.scopeMeta, 'dialogTitle')
      return {
        props: { title }
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
      const entry = flow.getMetaEntry(self, this.scopeMeta, 'controller')
      let items = entry.items
      if (isEmpty(items)) {
        items = []
      }
      items.push({
        float: 'right',
        text: '保  存',
        props: {
          icon: 'el-icon-antd-save',
          type: 'primary'
        },
        events: {
          click: self.save
        }
      })
      entry.items = items
      return entry
    },
    defaultModel: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'defaultModel')
    },
    handleModel: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'handleModel')
    },
    handleItems: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'handleItems')
    },
    getMethod: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'getMethod')
    },
    saveMethod: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'saveMethod')
    },
    beforeSave: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'beforeSave')
    },
    afterSave: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'afterSave')
    }
  },
  watch: {
    '$store.getters.flowInitializing': function(value) {
      if (value === false) {
        this.init()
      }
    }
  },
  created: function() {
    this.init()
  },
  methods: {
    ref(componentName) {
      return flow.ref(this, componentName)
    },
    getTemplateName() {
      return 'edit-basic'
    },
    getFlowActionData() {
      return [this.getModel()]
    },
    refresh() {
      // 空实现
    },
    init() {
      const currentRoute = router.currentRoute
      const routerName = currentRoute.name
      let scope = this.scope
      if (isEmpty(scope)) {
        scope = routerName
      }
      const scopeMeta = flow.getScopeMeta(routerName, scope)
      this.scopeMeta = scopeMeta
      this.components = flow.getMetaEntry(this, this.scopeMeta, 'components')
    },
    showDialog(primaryKey) {
      if (isNotEmpty(primaryKey)) {
        this.operate = 'edit'
        this.adding = false
        this.editing = true
      } else {
        this.operate = 'add'
        this.adding = true
        this.editing = false
      }
      this.ref().showDialog()
      this.loading = true
      if (this.adding) {
        this.model = this.defaultModel
        this.resetTo = this.defaultModel
        this.items = this.handleItems(this.operate, this.model)
        this.loading = false
      } else if (this.editing) {
        this.getMethod(primaryKey).then(response => {
          const model = response.data
          if (isNotEmpty(model)) {
            this.model = model
            this.resetTo = model
          } else {
            const defaultModel = Object.assign({}, this.defaultModel, primaryKey)
            this.model = defaultModel
            this.resetTo = defaultModel
          }
          this.items = this.handleItems(this.operate, this.model)
          this.loading = false
        })
      }
    },
    hideDialog() {
      this.ref().hideDialog()
    },
    save() {
      this.ref().validateForm().then(valid => {
        if (valid) {
          let model = this.getModel()
          let beforeBool = true
          if (isNotEmpty(this.beforeSave)) {
            beforeBool = this.beforeSave(this.operate, model)
            if (beforeBool === undefined) {
              beforeBool = true
            }
          }
          if (beforeBool) {
            this.saveMethod(model).then(response => {
              model = response.data
              this.model = model
              this.resetTo = model
              this.ref().hideDialog()
              if (isNotEmpty(this.afterSave)) {
                this.afterSave(this.operate, model)
              }
            })
          }
        }
      })
    },
    getModel() {
      return this.ref().getModel()
    },
    handleDialogInput(model) {
      const self = this
      const result = self.handleModel(self.operate, model)
      if (getDataType(result) === 'promise') {
        result.then(function(data) {
          self.model = data
          self.items = this.handleItems(this.operate, this.model)
        })
      } else {
        self.model = result
        self.items = this.handleItems(this.operate, this.model)
      }
    }
  }
}
</script>
