<template>
  <el-dialog :visible.sync="dialogVisible" v-bind="dialogProps" @closed="afterClose" v-on="dialogEvents">
    <div class="flagbar">
      <ty-button-status :value.sync="refreshFlag" tip="关闭时向父窗口返回刷新指令" size="mini" icon="el-icon-antd-sync" />
    </div>
    <ty-table-basic
      ref="ref"
      :controller="controller"
      :searcher="searcher"
      :table="payloadTable"
      :pagination-method="paginationMethod"
      :pagination-config="paginationConfig"
      @input="handleSearcherInput($event)" />
  </el-dialog>
</template>

<script>
import { getFuncName } from '@/utils'
import { isNotEmpty } from '@/utils/validate'
import TyTableBasic from '@/components/Typography/Table/Basic'
import TyButtonStatus from '@/components/Typography/Button/Status'

export default {
  name: 'TyTableDialog',
  components: { TyTableBasic, TyButtonStatus },
  props: {
    dialog: {
      type: Object,
      default: function() {
        return {}
      }
    },
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
          extraParams: 额外（固定）参数，每次查询默认附加这些参数
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
      dialogVisible: false,
      refreshFlag: true
    }
  },
  computed: {
    dialogProps: function() {
      return {
        ...this.dialog.props,
        fullscreen: true
      }
    },
    dialogEvents: function() {
      return this.dialog.events
    },
    payloadTable: function() {
      let height = this.$store.getters.deviceSize.height
      height -= 54 // [header 54]
      height -= 28 // [flagbar 28]
      height -= 60 // [bodypadding 60]
      height -= 40 // [mainpadding 40]
      if (isNotEmpty(this.controller.items) || isNotEmpty(this.searcher.items)) {
        height -= 64 // [controller / searcher 54 + 10]
      }
      const paginationMethodName = getFuncName(this.paginationMethod)
      if (isNotEmpty(paginationMethodName) && paginationMethodName !== 'defaultValue') {
        // defaultValue 为 flow 中指定的默认值
        height -= 62 // [pagination 30 + 32]
      }
      height -= 25 // [容差 25]
      return {
        props: {
          height,
          ...this.table.props,
          data: []
        },
        events: this.table.events,
        items: this.table.items
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    afterClose() {
      this.$emit('after-close', {
        refreshFlag: this.refreshFlag
      })
    },
    clearSearcher() {
      const ref = this.$refs.ref
      if (isNotEmpty(ref)) {
        ref.clearSearcher()
      }
    },
    doSearch() {
      const ref = this.$refs.ref
      if (isNotEmpty(ref)) {
        ref.doSearch()
      }
    },
    getQuerier() {
      const ref = this.$refs.ref
      if (isNotEmpty(ref)) {
        ref.getQuerier()
      }
    },
    ref() {
      return this.$refs.ref
    },
    handleSearcherInput(model) {
      this.$emit('input', model)
    }
  }
}
</script>

<style scoped>
.flagbar {
  margin-left: 20px;
}
</style>
