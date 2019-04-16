<template>
  <div>
    <ty-table-category ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <tax-type-edit ref="ref-tax-type-edit" @after-save="refresh" />
    <tax-type-caliber-list ref="ref-tax-type-caliber-list" @after-close="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { taxTypeList, taxTypeDelete } from '@/api/ftt'
import TyTableCategory from '@/components/Typography/Table/Category'
import TaxTypeEdit from './taxTypeEdit'
import TaxTypeCaliberList from './taxTypeCaliberList'

export default {
  name: 'TaxTypeList',
  components: { TyTableCategory, TaxTypeEdit, TaxTypeCaliberList },
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
              type: 'danger'
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
                    const ratios = selectedRows.map(selectedRow => {
                      return {
                        PRC_PAY_SITE: selectedRow.PRC_PAY_SITE,
                        PRC_EFFECTIVE_DATE: selectedRow.PRC_EFFECTIVE_DATE,
                        PRC_EXPIRY_DATE: selectedRow.PRC_EXPIRY_DATE
                      }
                    })
                    taxTypeDelete(ratios).then(response => {
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
            props: { label: '税种名', prop: 'TT_NAME' },
            items: [
              { tag: 'el-input', name: 'TT_NAME' }
            ]
          },
          {
            props: { label: '状态', prop: 'TT_STATUS' },
            items: buildFormItemsByDicts('ED', 'el-radio', 'TT_STATUS')
          }
        ]
      },
      table: {
        items: [
          {
            props: {
              label: '税种号',
              prop: 'TT_ID',
              fixed: 'left',
              width: '100'
            }
          },
          {
            props: {
              label: '税种名',
              prop: 'TT_NAME',
              fixed: 'left',
              width: '150'
            }
          },
          {
            props: {
              label: '状态',
              prop: 'TT_STATUS',
              align: 'center',
              width: '75',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('ED', cellValue)
              }
            }
          },
          {
            props: {
              label: '描述',
              prop: 'TT_DESCR',
              width: '1000'
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
                const ejData = {
                  on: { 'click': () => self.showEdit(row.TT_ID) }
                }
                const cjData = {
                  on: { 'click': () => self.showTaxTypeCalibers(row.TT_ID) }
                }
                return [<el-button type='text' { ...ejData }>编辑</el-button>, <el-button type='text' { ...cjData }>口径</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: taxTypeList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(TT_ID) {
      this.$refs['ref-tax-type-edit'].showDialog(TT_ID)
    },
    showTaxTypeCalibers(TT_ID) {
      this.$refs['ref-tax-type-caliber-list'].showDialog(TT_ID)
    }
  }
}
</script>
