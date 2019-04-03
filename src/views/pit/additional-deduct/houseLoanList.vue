<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <house-loan-edit ref="ref-house-loan-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { houseLoanList, houseLoanDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import HouseLoanEdit from './houseLoanEdit'

export default {
  name: 'HouseLoanList',
  components: { TypographyTableBasic, HouseLoanEdit },
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
                if (isNotEmpty(selectedRows)) {
                  self.$confirm('是否删除数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const ADHL_IDS = selectedRows.map(selectedRow => selectedRow.ADHL_ID)
                    houseLoanDelete(ADHL_IDS).then(response => {
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
        items: []
      },
      table: {
        items: [
          {
            props: {
              label: '房屋证书类型',
              prop: 'ADHL_CERTIFICATE_TYPE',
              fixed: 'left',
              width: '125',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('AD_H3E_L2N_ADHL_CERTIFICATE_TYPE', cellValue)
              }
            }
          },
          {
            props: {
              label: '房屋证书编号',
              prop: 'ADHL_CERTIFICATE_ID',
              fixed: 'left',
              width: '175'
            }
          },
          {
            props: {
              label: '房屋坐落地址',
              prop: 'ADHL_ADDRESS',
              width: '750'
            }
          },
          {
            props: {
              label: '扣除比例（%）',
              prop: 'ADHL_RATIO',
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
                  on: { 'click': () => self.showEdit(row.ADHL_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: houseLoanList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(ADHL_ID) {
      this.$refs['ref-house-loan-edit'].showDialog(ADHL_ID)
    }
  }
}
</script>
