<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <tax-stair-edit ref="ref-tax-stair-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { taxStairList, taxStairDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import TaxStairEdit from './taxStairEdit'

export default {
  name: 'TaxStairList',
  components: { TypographyTableBasic, TaxStairEdit },
  data() {
    const self = this
    return {
      controller: {
        items: [
          {
            text: '新增',
            props: {
              icon: 'el-icon-antd-plus'
            },
            events: {
              click: function() {
                self.showEdit('')
              }
            }
          },
          {
            selectedRowVisible: true,
            text: '删除',
            props: {
              icon: 'el-icon-antd-delete',
              type: 'danger',
              plain: true
            },
            events: {
              click: function() {
                const selectedRows = self.$refs['ref'].selectedRows
                if (isNotEmpty(selectedRows)) {
                  self.$confirm('是否删除数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const TSC_IDS = selectedRows.map(selectedRow => selectedRow.TSC_ID)
                    taxStairDelete(TSC_IDS).then(response => {
                      self.refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          }
        ]
      },
      searcher: {
        items: [
          {
            props: { label: '是否居民', prop: 'TSC_IS_RESIDENT' },
            items: buildFormItemsByDicts('YN', 'el-radio', 'TSC_IS_RESIDENT')
          },
          {
            props: { label: '所得类型', prop: 'TSC_INCOME_TYPE' },
            items: [
              {
                tag: 'el-select',
                name: 'TSC_INCOME_TYPE',
                items: buildFormItemsByDicts('T1X_S3R_C4G_TSC_INCOME_TYPE', 'el-option')
              }
            ]
          }
        ]
      },
      table: {
        items: [
          {
            props: {
              label: '有效期',
              prop: 'TSC_EFFECTIVE_DATE',
              fixed: 'left',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '失效期',
              prop: 'TSC_EXPIRY_DATE',
              fixed: 'left',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '是否居民',
              prop: 'TSC_IS_RESIDENT',
              fixed: 'left',
              align: 'center',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('YN', cellValue)
              }
            }
          },
          {
            props: {
              label: '所得类型',
              prop: 'TSC_INCOME_TYPE',
              fixed: 'left',
              width: '150',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('T1X_S3R_C4G_TSC_INCOME_TYPE', cellValue)
              }
            }
          },
          {
            props: {
              label: '级数',
              prop: 'TSC_LEVEL',
              align: 'center',
              width: '75'
            }
          },
          {
            props: {
              label: '预扣预缴额度',
              prop: 'TSC_AMOUNT',
              width: '125'
            }
          },
          {
            props: {
              label: '预扣率（%）',
              prop: 'TSC_RATIO',
              width: '125'
            }
          },
          {
            props: { prop: 'fill' }
          },
          {
            props: {
              label: '操作',
              prop: 'action',
              fixed: 'right',
              align: 'center',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                const jsxData = {
                  on: { 'click': () => self.showEdit(row.TSC_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: taxStairList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(TSC_ID) {
      this.$refs['ref-tax-stair-edit'].showDialog(TSC_ID)
    }
  }
}
</script>
