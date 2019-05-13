<template>
  <el-dialog :visible.sync="dialogVisible" v-bind="dialogProps" @closed="afterClose" v-on="dialogEvents">
    <div class="flagbar">
      <ty-button-status :value.sync="refreshFlag" tip="关闭时向父窗口返回刷新指令" size="mini" icon="el-icon-antd-sync" />
    </div>
    <ty-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="payloadTable" :pagination-method="paginationMethod" />
  </el-dialog>
</template>

<script>
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
      default: function() {}
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
      return {
        props: {
          // [header 54] + [flagbar 28] + [bodypadding 60] + [mainpadding 40] + [searcher 54 + 10] + [pagination 30 + 32] + [容差 25]
          height: this.$store.getters.deviceSize.height - 333,
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
    }
  }
}
</script>

<style scoped>
.flagbar {
  margin-left: 20px;
}
</style>
