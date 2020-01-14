<template>
  <div v-if="!flowInitializing">
    <ty-form-plane
      ref="ref"
      :form="form"
      :loading="loading"
      :controller="controller"
      @input="handleInput($event)" />
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
import { passable } from '@/utils/request'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import TyFormPlane from '@/components/Typography/Form/Plane'

/**
 * Flow 页面模板
 * 基础的查看数据模板
 */
export default {
  name: 'TyFlowEditPlane',
  components: { TyFormPlane },
  props: {
    routerName: {
      type: String,
      default: function() {
        return ''
      }
    },
    scope: {
      type: String,
      default: function() {
        return ''
      }
    },
    primaryKey: {
      type: Object,
      default: function() {
        return {}
      }
    },
    extraParams: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      flowInitializing: true,
      scopeMeta: {},
      components: [],
      operate: 'view',
      model: {},
      items: [],
      loading: false
    }
  },
  computed: {
    form: function() {
      const title = flow.getMetaEntry(this, this.scopeMeta, 'formTitle')
      return {
        title,
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
    }
  },
  watch: {
    '$store.getters.flowInitializing': function(value) {
      if (value === false) {
        this.flowInitializing = false
        this.init()
        this.initForm()
      }
    }
  },
  created: function() {
    this.flowInitializing = this.$store.getters.flowInitializing
    if (this.flowInitializing === false) {
      this.init()
      this.initForm()
    }
  },
  methods: {
    ref(componentName) {
      return flow.ref(this, componentName)
    },
    getTemplateName() {
      return 'ViewPlane'
    },
    getFlowActionData() {
      return [this.getModel()]
    },
    refresh() {
      // 空实现
    },
    init() {
      let routerName = this.routerName
      if (isEmpty(routerName)) {
        const currentRoute = router.currentRoute
        routerName = currentRoute.name
      }
      let scope = this.scope
      if (isEmpty(scope)) {
        scope = routerName
      }
      const scopeMeta = flow.getScopeMeta(routerName, scope)
      this.scopeMeta = scopeMeta
      this.components = flow.getMetaEntry(this, this.scopeMeta, 'components')
    },
    initForm() {
      // 首先从 props 传参中获取，未找到则从路由传参中获取
      let primaryKey = this.primaryKey
      if (isEmpty(primaryKey)) {
        primaryKey = this.$route.query && this.$route.query.primaryKey
      }
      if (isEmpty(primaryKey)) {
        primaryKey = this.$route.params && this.$route.params.primaryKey
      }
      let extraParams = this.extraParams
      if (isEmpty(extraParams)) {
        extraParams = this.$route.query && this.$route.query.extraParams
      }
      if (isEmpty(extraParams)) {
        extraParams = this.$route.params && this.$route.params.extraParams
      }
      if (isNotEmpty(primaryKey)) {
        this.loading = true
        this.getMethod(primaryKey).then(response => {
          if (passable(response)) {
            const model = response.data
            if (isNotEmpty(model)) {
              this.model = model
            } else {
              this.model = Object.assign({}, this.defaultModel, primaryKey, extraParams)
            }
          } else {
            this.model = Object.assign({}, primaryKey, extraParams)
          }
          this.items = this.handleItems(this.operate, this.model)
          this.loading = false
        })
      } else {
        this.loading = true
        this.model = Object.assign({}, this.defaultModel, primaryKey, extraParams)
        this.items = this.handleItems(this.operate, this.model)
        this.loading = false
      }
    },
    getModel() {
      return this.ref().getModel()
    },
    handleInput(model) {
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
