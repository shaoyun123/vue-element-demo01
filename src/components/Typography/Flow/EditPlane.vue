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
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { showMessage } from '@/utils/element'
import TyFormPlane from '@/components/Typography/Form/Plane'

/**
 * Flow 页面模板
 * 基础的编辑数据模板
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
    form: function() {
      const title = flow.getMetaEntry(this, this.scopeMeta, 'formTitle')
      return {
        title,
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
      return 'EditPlane'
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
        this.operate = 'edit'
        this.adding = false
        this.editing = true
      } else {
        this.operate = 'add'
        this.adding = true
        this.editing = false
      }
      if (this.adding) {
        this.loading = true
        this.model = Object.assign({}, this.defaultModel, extraParams)
        this.resetTo = this.model
        this.items = this.handleItems(this.operate, this.model)
        this.loading = false
      } else if (this.editing) {
        this.loading = true
        this.getMethod(primaryKey).then(response => {
          const model = response.data
          if (isNotEmpty(model)) {
            this.model = model
          } else {
            this.model = Object.assign({}, this.defaultModel, primaryKey, extraParams)
          }
          this.resetTo = this.model
          this.items = this.handleItems(this.operate, this.model)
          this.loading = false
        })
      }
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
            model.operate = this.operate
            this.saveMethod(model).then(response => {
              model = response.data
              this.model = model
              this.resetTo = model
              showMessage({ content: '数据保存成功' })
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
