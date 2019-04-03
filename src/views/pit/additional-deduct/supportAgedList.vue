<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <support-aged-edit ref="ref-support-aged-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { supportAgedList, supportAgedDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import SupportAgedEdit from './supportAgedEdit'

export default {
  name: 'SupportAgedList',
  components: { TypographyTableBasic, SupportAgedEdit },
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
                    const ADSA_IDS = selectedRows.map(selectedRow => selectedRow.ADSA_ID)
                    supportAgedDelete(ADSA_IDS).then(response => {
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
              label: '被赡养人关系',
              prop: 'ADSA_RELATION',
              fixed: 'left',
              width: '125',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('AD_S5T_A2D_ADSA_RELATION', cellValue)
              }
            }
          },
          {
            props: {
              label: '被赡养人姓名',
              prop: 'ADSA_NAME',
              fixed: 'left',
              width: '150'
            }
          },
          {
            props: {
              label: '分摊方式',
              prop: 'ADSA_APPORTION_TYPE',
              width: '150',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('AD_S5T_A2D_ADSA_APPORTION_TYPE', cellValue)
              }
            }
          },
          {
            props: {
              label: '共同赡养人姓名',
              prop: 'ADSA_PARTNER_NAME',
              width: '150'
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
                  on: { 'click': () => self.showEdit(row.ADSA_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: supportAgedList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(ADSA_ID) {
      this.$refs['ref-support-aged-edit'].showDialog(ADSA_ID)
    }
  }
}
</script>
