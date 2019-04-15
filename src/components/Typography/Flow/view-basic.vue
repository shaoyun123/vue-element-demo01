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
import { isEmpty, isNotEmpty } from '@/utils/validate'
import TyFormBasic from '@/components/Typography/Form/basic'

export default {
  name: 'TyFlowViewBasic',
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
      operate: 'view',
      items: [],
      model: {},
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
      entry.showReset = false
      entry.items = items
      return entry
    },
    handleItems: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'handleItems')
    },
    getMethod: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'getMethod')
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
      return 'view-basic'
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
      this.ref().showDialog()
      this.loading = true
      if (isNotEmpty(primaryKey)) {
        this.getMethod(primaryKey).then(response => {
          this.model = response.data
          this.items = this.handleItems(this.operate, this.model)
          this.loading = false
        })
      }
    },
    hideDialog() {
      this.ref().hideDialog()
    },
    getModel() {
      return this.ref().getModel()
    }
  }
}
</script>
