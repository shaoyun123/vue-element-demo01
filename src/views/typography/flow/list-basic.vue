<template>
  <div>
    <ty-table-basic
      ref="ref"
      :controller="controller"
      :searcher="searcher"
      :table="table"
      :pagination-method="paginationMethod" />
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
import TyTableBasic from '@/components/Typography/Table/basic'

export default {
  name: 'TyFlowListBasic',
  components: { TyTableBasic },
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
      components: []
    }
  },
  computed: {
    controller: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'controller')
    },
    searcher: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'searcher')
    },
    table: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'table')
    },
    paginationMethod: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'paginationMethod')
    }
  },
  watch: {
    '$store.getters.flowInitializing': function(value) {
      if (value === false) {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    ref(componentName) {
      return flow.ref(this, componentName)
    },
    getTemplateName() {
      return 'list-basic'
    },
    getFlowActionData() {
      return this.ref().selectedRows
    },
    refresh() {
      this.ref().doSearch()
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
    }
  }
}
</script>
