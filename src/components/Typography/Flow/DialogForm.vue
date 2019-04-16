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
import { isEmpty } from '@/utils/validate'
import TyFormBasic from '@/components/Typography/Form/Basic'

/**
 * Flow 页面模板
 * 表单对话框模板
 */
export default {
  name: 'TyFlowDialogForm',
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
      return flow.getMetaEntry(this, this.scopeMeta, 'controller')
    },
    defaultModel: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'defaultModel')
    },
    handleModel: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'handleModel')
    },
    handleItems: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'handleItems')
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
      return 'DialogForm'
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
    showDialog() {
      this.ref().showDialog()
      this.loading = true
      this.model = this.defaultModel
      this.resetTo = this.defaultModel
      this.items = this.handleItems(this.operate, this.model)
      this.loading = false
    },
    hideDialog() {
      this.ref().hideDialog()
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
