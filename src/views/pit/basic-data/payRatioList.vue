<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <pay-ratio-edit ref="ref-pay-ratio-edit" @after-save="refresh" />
  </div>
</template>

<script>
import * as validator from '@/utils/validate'
import { payRatioList, payRatioDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import PayRatioEdit from './payRatioEdit'

export default {
  name: 'TaxStairList',
  components: { TypographyTableBasic, PayRatioEdit },
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
                self.showEdit({})
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
                if (validator.isNotEmpty(selectedRows)) {
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
                    payRatioDelete(ratios).then(response => {
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
            props: { label: '缴纳地', prop: 'PRC_PAY_SITE' },
            items: [
              {
                tag: 'el-cascader',
                name: 'PRC_PAY_SITE',
                props: { options: this.$store.getters.getDistricts }
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
              prop: 'PRC_EFFECTIVE_DATE',
              fixed: 'left',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '失效期',
              prop: 'PRC_EXPIRY_DATE',
              fixed: 'left',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '缴纳地',
              prop: 'PRC_PAY_SITE',
              width: '150',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDistrictTitle(cellValue[cellValue.length - 1])
              }
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
                const ratio = {
                  PRC_PAY_SITE: row.PRC_PAY_SITE,
                  PRC_EFFECTIVE_DATE: row.PRC_EFFECTIVE_DATE,
                  PRC_EXPIRY_DATE: row.PRC_EXPIRY_DATE
                }
                const jsxData = {
                  on: { 'click': () => self.showEdit(ratio) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: payRatioList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(ratio) {
      this.$refs['ref-pay-ratio-edit'].showDialog(ratio)
    }
  }
}
</script>
