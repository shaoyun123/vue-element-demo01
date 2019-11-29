<template>
  <el-container>
    <el-aside>
      <el-tree-basic ref="ref-category" :controller="categoryController" :tree="payloadCategoryTree" class="category" />
    </el-aside>
    <el-table-basic
      ref="ref-table"
      :controller="controller"
      :searcher="payloadSearcher"
      :table="table"
      :pagination-method="paginationMethod"
      @input="handleSearcherInput($event)" />
  </el-container>
</template>

<script>
import ElTreeBasic from '@/components/Typography/Tree/Basic'
import ElTableBasic from '@/components/Typography/Table/Basic'

export default {
  name: 'TyTableCategory',
  components: { ElTreeBasic, ElTableBasic },
  props: {
    categoryController: {
      type: Object,
      default: function() {
        return {}
      }
    },
    categoryTree: {
      type: Object,
      default: function() {
        return {}
      }
    },
    linkageMethod: {
      type: Function,
      default: function(data, node) {
        return data
      }
    },
    controller: {
      type: Object,
      default: function() {
        return {}
      }
    },
    searcher: {
      type: Object,
      default: function() {
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
    const extraParams = this.searcher.extraParams || {}
    return {
      defaultExtraParams: extraParams,
      linkageValue: extraParams
    }
  },
  computed: {
    payloadCategoryTree: function() {
      const self = this
      return {
        menu: self.categoryTree.menu,
        props: self.categoryTree.props,
        events: {
          ...self.categoryTree.events,
          'current-change': self.changeCategory
        }
      }
    },
    payloadSearcher: function() {
      return Object.assign({}, this.searcher, { extraParams: this.linkageValue })
    }
  },
  methods: {
    refresh(node) {
      this.refCategory().reloadNode(node)
      this.linkageValue = this.defaultExtraParams
    },
    changeCategory(data, node) {
      this.linkageValue = this.linkageMethod(data, node)
    },
    refCategory() {
      return this.$refs['ref-category']
    },
    refTable() {
      return this.$refs['ref-table']
    },
    handleSearcherInput(model) {
      this.$emit('input', model)
    }
  }
}
</script>

<style scoped>
.category {
  padding-right: 0px;
}
</style>
