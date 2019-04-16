<template>
  <div>
    <ty-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <house-rent-edit ref="ref-house-rent-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { houseRentList, houseRentDelete } from '@/api/pit'
import TyTableBasic from '@/components/Typography/Table/Basic'
import HouseRentEdit from './houseRentEdit'

export default {
  name: 'HouseRentList',
  components: { TyTableBasic, HouseRentEdit },
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
                    const ADHR_IDS = selectedRows.map(selectedRow => selectedRow.ADHR_ID)
                    houseRentDelete(ADHR_IDS).then(response => {
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
              label: '主要工作地',
              prop: 'ADHR_WORK_SITE',
              fixed: 'left',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                if (Array.isArray(cellValue)) {
                  let title = ''
                  cellValue.forEach((value, index) => {
                    if (index > 0) {
                      title += ' / '
                    }
                    title += self.$store.getters.getDistrictTitle(value)
                  })
                  return title
                }
                return cellValue
              }
            }
          },
          {
            props: {
              label: '出租方类型',
              prop: 'ADHR_LESSOR_TYPE',
              align: 'center',
              fixed: 'left',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('AD_H3E_R2T_ADHR_LESSOR_TYPE', cellValue)
              }
            }
          },
          {
            props: {
              label: '出租方名称',
              prop: 'ADHR_LESSOR_NAME',
              fixed: 'left',
              width: '175'
            }
          },
          {
            props: {
              label: '起始时间',
              prop: 'ADHR_LEASE_DATE_START',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '结束时间',
              prop: 'ADHR_LEASE_DATE_END',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '住房坐落地址',
              prop: 'ADHR_ADDRESS',
              width: '750'
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
                  on: { 'click': () => self.showEdit(row.ADHR_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: houseRentList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(ADHR_ID) {
      this.$refs['ref-house-rent-edit'].showDialog(ADHR_ID)
    }
  }
}
</script>
