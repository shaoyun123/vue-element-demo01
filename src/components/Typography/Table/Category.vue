<template>
  <el-container>
    <el-aside class="aside">
      <div class="controller">
        <ty-button-controller :controller="treeController" @input="handleInput($event)" />
      </div>
    </el-aside>
    <el-table-basic :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
  </el-container>
</template>

<script>
import TyButtonController from '@/components/Typography/Button/Controller'
import ElTableBasic from '@/components/Typography/Table/Basic'

export default {
  name: 'TyTableCategory',
  components: { TyButtonController, ElTableBasic },
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
      default: function() {}
    }
  },
  data() {
    return {
      queryString: '123'
    }
  },
  computed: {
    treeController: function() {
      const self = this
      const items = []
      items.push({
        tag: 'el-popover-wrap',
        float: 'right',
        'slot': {
          tag: 'el-input',
          props: { value: self.queryString },
          items: [
            {
              tag: 'el-button',
              props: { slot: 'append', class: 'el-icon-antd-search' },
              events: {
                click: function() {
                  alert(self.queryString)
                }
              }
            }
          ]
        },
        'slot-reference': {
          props: {
            icon: 'el-icon-antd-search',
            type: 'primary'
          }
        }
      })
      return {
        items,
        events: {
          'input11': function(value) {
            alert(value)
          }
        }
      }
    }
  },
  methods: {
    handleInput(value) {
      this.queryString = value
    }
  }
}
</script>

<style scoped>
.aside {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
}

.controller {
  margin-bottom: 10px;
}
</style>
