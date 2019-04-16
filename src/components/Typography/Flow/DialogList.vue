<template>
  <div>
    <ty-table-dialog
      ref="ref"
      :dialog="dialog"
      :controller="controller"
      :searcher="searcher"
      :table="table"
      :pagination-method="paginationMethod"
      @after-close="afterClose" />
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
import TyTableDialog from '@/components/Typography/Table/Dialog'

/**
 * Flow 页面模板
 * 列表对话框模板
 */
export default {
  name: 'TyFlowDialogList',
  components: { TyTableDialog },
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
      extraParams: {}
    }
  },
  computed: {
    dialog: function() {
      const title = flow.getMetaEntry(this, this.scopeMeta, 'dialogTitle')
      return {
        props: { title }
      }
    },
    controller: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'controller')
    },
    searcher: function() {
      const searcher = flow.getMetaEntry(this, this.scopeMeta, 'searcher')
      return Object.assign({}, searcher, { extraParams: this.extraParams })
    },
    table: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'table')
    },
    paginationMethod: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'paginationMethod')
    },
    afterClose: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'afterClose')
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
      return 'DialogList'
    },
    getFlowActionData() {
      return this.ref().ref().selectedRows
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
    },
    showDialog(primaryKey) {
      this.ref().showDialog()
      if (JSON.stringify(primaryKey) !== JSON.stringify(this.extraParams)) {
        this.extraParams = primaryKey
        this.ref().clearSearcher()
      }
    },
    hideDialog() {
      this.ref().hideDialog()
    }
  }
}
</script>
