<template>
  <div v-if="!flowInitializing">
    <ty-table-dialog
      ref="ref"
      :dialog="dialog"
      :controller="controller"
      :searcher="searcher"
      :table="table"
      :pagination-method="paginationMethod"
      @input="handleSearcherInput($event)"
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
      extraParams: {},
      model: {}
    }
  },
  computed: {
    dialog: function() {
      const title = flow.getMetaEntry(this, this.scopeMeta, 'formTitle')
      return {
        props: { title }
      }
    },
    controller: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'controller')
    },
    searcher: function() {
      const searcher = flow.getMetaEntry(this, this.scopeMeta, 'searcher')(this.model)
      return Object.assign({}, searcher, { extraParams: this.extraParams }, {
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
    },
    afterClose: function() {
      return flow.getMetaEntry(this, this.scopeMeta, 'afterClose')
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
  created: function() {
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
      return 'DialogList'
    },
    getFlowActionData() {
      return this.ref().ref().selectedRows
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
    showDialog(extraParams) {
      this.ref().showDialog()
      if (JSON.stringify(extraParams) !== JSON.stringify(this.extraParams)) {
        this.extraParams = extraParams
        this.ref().clearSearcher()
      }
    },
    hideDialog() {
      this.ref().hideDialog()
    },
    handleSearcherInput(model) {
      this.model = model
    }
  }
}
</script>
