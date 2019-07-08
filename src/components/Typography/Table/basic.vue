<template>
  <el-main>
    <div class="controller">
      <ty-button-controller :controller="payloadController" />
      <ty-form-basic ref="ref-searcher" :dialog="payloadDialog" :form="payloadForm" :controller="payloadFormController" @input="handleDialogInput($event)" />
    </div>
    <el-table-wrap :c-o-m="payloadTable" :loading="loading" />
    <pagination v-show="total > 0" :total="total" :page.sync="querier.page" :limit.sync="querier.limit" @pagination="getResults" />
  </el-main>
</template>

<script>
import { isEmpty, isNotEmpty } from '@/utils/validate'
import ElTableWrap from '@/components/Typography/Wrap/ElTableWrap'
import TyButtonController from '@/components/Typography/Button/Controller'
import TyFormBasic from '@/components/Typography/Form/Basic'
import Pagination from '@/components/Pagination'

export default {
  name: 'TyTableBasic',
  components: { ElTableWrap, TyButtonController, TyFormBasic, Pagination },
  props: {
    controller: {
      type: Object,
      default: function() {
        /*
        action 基于 ComponentObjectModel 扩展
          selectedRowVisible: 是否选中数据行时显示按钮 [false（默认） | true]
        */
        return {}
      }
    },
    searcher: {
      type: Object,
      default: function() {
        /*
        searcher 基于 ComponentObjectModel 扩展
          extraParams: 额外参数，每次查询默认附加这些参数，extraParams 的变化将触发数据加载
        */
        return {}
      }
    },
    table: {
      type: Object,
      default: function() {
        return {}
      }
    },
    paginationMethod: {
      type: Function,
      default: function() {
        return Promise.resolve({
          data: { items: [], total: 0 }
        })
      }
    },
    paginationConfig: {
      type: Object,
      default: function() {
        return {
          itemsField: 'items',
          totalField: 'total'
        }
      }
    }
  },
  data() {
    return {
      results: [],
      total: 0,
      loading: false,
      extraParams: {},
      model: {},
      querier: { page: 1, limit: 20 },
      selectedRows: []
    }
  },
  computed: {
    payloadController: function() {
      const self = this
      const items = []
      if (isNotEmpty(self.controller.items)) {
        self.controller.items.forEach((item, index) => {
          if (item.selectedRowVisible) {
            if (isNotEmpty(self.selectedRows)) {
              items.push(item)
            }
          } else {
            items.push(item)
          }
        })
      }
      if (isNotEmpty(self.searcher.items)) {
        /*
        检查是否有搜索条件
        检查到搜索条件后对按钮进行样式处理，提醒用户
        * model 中默认有 page、limit 2 个属性，可以根据属性数量进行判断
        */
        let tip = ''
        let type = 'primary'
        if (Object.keys(this.model).length > 2) {
          tip = '点击查看已使用的搜索条件'
          type = 'success'
        }
        items.push({
          tip,
          float: 'right',
          text: '搜索器',
          props: {
            icon: 'el-icon-antd-search',
            type
          },
          events: {
            click: self.showSearcher
          }
        })
      }
      return {
        ...self.controller,
        items
      }
    },
    payloadDialog: function() {
      return {
        props: {
          title: '搜索器'
        }
      }
    },
    payloadForm: function() {
      this.setExtraParams(this.searcher.extraParams)
      return Object.assign({}, this.searcher, {
        props: { model: this.model }
      })
    },
    payloadFormController: function() {
      const self = this
      return {
        items: [
          {
            float: 'right',
            text: '查  询',
            props: { icon: 'el-icon-antd-search', type: 'primary' },
            events: { click: self.doSearch }
          }
        ]
      }
    },
    payloadTable: function() {
      const self = this
      return {
        props: {
          // [topbar 50] + [tagbar 33 + 1] + [mainpadding 40] + [searcher 54 + 10] + [pagination 30 + 32] + [容差 25]
          height: self.$store.getters.deviceSize.height - 275,
          ...self.table.props,
          data: self.results
        },
        events: {
          'selection-change': function(selection) {
            self.selectionChange(selection)
          },
          ...self.table.events
        },
        items: self.table.items
      }
    }
  },
  watch: {
    extraParams: function(newVal, oldVal) {
      if (
        (isNotEmpty(newVal) || isNotEmpty(oldVal)) &&
        JSON.stringify(newVal) !== JSON.stringify(oldVal)
      ) {
        this.doSearch()
      }
    }
  },
  created() {
    const extraParams = this.searcher.extraParams
    if (isEmpty(extraParams)) {
      this.doSearch()
    }
  },
  methods: {
    setExtraParams(extraParams) {
      this.extraParams = extraParams || {}
    },
    showSearcher() {
      this.$refs['ref-searcher'].showDialog()
    },
    clearSearcher() {
      const ref = this.$refs['ref-searcher']
      if (isNotEmpty(ref)) {
        ref.clearForm()
      }
    },
    doSearch() {
      this.querier.page = 1
      this.getResults()
      const ref = this.$refs['ref-searcher']
      if (isNotEmpty(ref)) {
        ref.hideDialog()
      }
    },
    initQuerier() {
      const { page, limit } = this.querier
      let model = {}
      const ref = this.$refs['ref-searcher']
      if (isNotEmpty(ref)) {
        model = ref.getModel()
      }
      model = Object.assign({}, this.model, model, { page, limit })
      Object.keys(model).forEach(key => {
        const value = model[key]
        if (isEmpty(value)) {
          delete model[key]
        }
      })
      this.model = model
      this.querier = Object.assign({}, model, this.extraParams)
    },
    getQuerier() {
      return this.querier
    },
    getResults() {
      this.loading = true
      this.initQuerier()
      this.paginationMethod(this.querier).then(response => {
        if (isNotEmpty(response) && isNotEmpty(response.data)) {
          const data = response.data
          this.results = data[this.paginationConfig.itemsField]
          this.total = data[this.paginationConfig.totalField]
        }
        this.loading = false
      })
    },
    selectionChange(selection) {
      this.selectedRows = selection
    },
    handleDialogInput(model) {
      this.querier = model
    }
  }
}
</script>

<style scoped>
.controller {
  margin-bottom: 10px;
}
</style>
