<template>
  <div v-if="!flowInitializing">
    <ty-table-category
      ref="ref"
      :category-controller="categoryController"
      :category-tree="categoryTree"
      :linkage-method="linkageMethod"
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
import TyTableCategory from '@/components/Typography/Table/Category'

/**
 * Flow 页面模板
 * 带分类树的数据列表模板
 */
export default {
  name: 'TyFlowListCategory',
  components: { TyTableCategory },
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
      components: []
    }
  },
  computed: {
    categoryController: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'categoryController')
    },
    categoryTree: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'categoryTree')
    },
    linkageMethod: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'linkageMethod')
    },
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
      return 'ListCategory'
    },
    getFlowActionData() {
      return this.ref().refTable().selectedRows
    },
    refresh() {
      this.ref().refresh()
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
    }
  }
}
</script>
