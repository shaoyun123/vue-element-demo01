<template>
  <div v-if="!flowInitializing">
    <ty-table-basic
      ref="ref"
      :controller="controller"
      :searcher="searcher"
      :table="table"
      :pagination-method="paginationMethod"
      @input="handleSearcherInput($event)" />
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
import { isEmpty } from '@/utils/validate'
import TyTableBasic from '@/components/Typography/Table/Basic'

/**
 * Flow 页面模板
 * 基础的数据列表模板
 */
export default {
  name: 'TyFlowListBasic',
  components: { TyTableBasic },
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
    }
  },
  data() {
    return {
      flowInitializing: true,
      scopeMeta: {},
      components: [],
      model: {}
    }
  },
  computed: {
    controller: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'controller')
    },
    searcher: function() {
      const searcher = flow.getMetaEntry(this, this.scopeMeta, 'searcher')(this.model)
      return Object.assign({}, searcher, {
        props: { model: this.model }
      })
    },
    table: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'table')
    },
    paginationMethod: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'paginationMethod')
    },
    paginationConfig: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'paginationConfig')
    }
  },
  watch: {
    '$store.getters.flowInitializing': function(value) {
      if (value === false) {
        this.flowInitializing = false
        this.init()
      }
    }
  },
  created() {
    this.flowInitializing = this.$store.getters.flowInitializing
    if (this.flowInitializing === false) {
      this.init()
    }
  },
  methods: {
    ref(componentName) {
      return flow.ref(this, componentName)
    },
    getTemplateName() {
      return 'ListBasic'
    },
    getFlowActionData() {
      return this.ref().selectedRows
    },
    refresh() {
      this.ref().doSearch()
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
    handleSearcherInput(model) {
      this.model = model
    }
  }
}
</script>
