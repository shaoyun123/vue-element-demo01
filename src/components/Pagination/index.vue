<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-row>
      <el-col :span="8">
        <el-button-group>
          <el-button-wrap :c-o-m="refreshButton" />
        </el-button-group>
      </el-col>
      <el-col :span="16">
        <el-pagination
          :background="background"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :layout="layout"
          :page-sizes="pageSizes"
          :total="total"
          v-bind="$attrs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'
import ElButtonWrap from '@/components/Typography/Wrap/ElButtonWrap'

export default {
  name: 'Pagination',
  components: { ElButtonWrap },
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'slot, ->, total, prev, pager, next, sizes'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this
    return {
      refreshButton: {
        tip: '刷新当前页',
        props: {
          plain: false,
          icon: 'el-icon-antd-retweet'
        },
        events: {
          click: self.refresh
        }
      }
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    refresh() {
      this.$emit('pagination', { page: this.currentPage, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 0px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
