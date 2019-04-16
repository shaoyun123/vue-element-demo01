<template>
  <div>
    <ty-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <medical-edit ref="ref-medical-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { medicalList, medicalDelete } from '@/api/pit'
import TyTableBasic from '@/components/Typography/Table/Basic'
import MedicalEdit from './medicalEdit'

export default {
  name: 'MedicalList',
  components: { TyTableBasic, MedicalEdit },
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
                    const ADM_IDS = selectedRows.map(selectedRow => selectedRow.ADM_ID)
                    medicalDelete(ADM_IDS).then(response => {
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
              label: '关系',
              prop: 'ADM_RELATION',
              fixed: 'left',
              width: '125',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('AD_M5L_ADM_RELATION', cellValue)
              }
            }
          },
          {
            props: {
              label: '姓名',
              prop: 'ADM_NAME',
              fixed: 'left',
              width: '150'
            }
          },
          {
            props: {
              label: '医药费用总金额',
              prop: 'ADM_MEDICAL_EXPENSE',
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
                  on: { 'click': () => self.showEdit(row.ADM_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: medicalList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(ADM_ID) {
      this.$refs['ref-medical-edit'].showDialog(ADM_ID)
    }
  }
}
</script>
