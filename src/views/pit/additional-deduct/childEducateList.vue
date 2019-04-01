<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <child-educate-edit ref="ref-child-educate-edit" @after-save="refresh" />
  </div>
</template>

<script>
import * as validator from '@/utils/validate'
import { childEducateList, childEducateDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import ChildEducateEdit from './childEducateEdit'

export default {
  name: 'ChildEducateList',
  components: { TypographyTableBasic, ChildEducateEdit },
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
                    const ADCE_IDS = selectedRows.map(selectedRow => selectedRow.ADCE_ID)
                    childEducateDelete(ADCE_IDS).then(response => {
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
              label: '子女姓名',
              prop: 'ADCE_NAME',
              fixed: 'left',
              width: '100'
            }
          },
          {
            props: {
              label: '受教育阶段',
              prop: 'ADCE_EDUCATE_STAGE',
              width: '125',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('AD_C3D_E5E_ADCE_EDUCATE_STAGE', cellValue)
              }
            }
          },
          {
            props: {
              label: '起始时间',
              prop: 'ADCE_STAGE_START',
              align: 'center',
              width: '125'
            }
          },
          {
            props: {
              label: '结束时间',
              prop: 'ADCE_STAGE_END',
              align: 'center',
              width: '125'
            }
          },
          {
            props: {
              label: '教育终止时间',
              prop: 'ADCE_EDUCATE_STOP',
              align: 'center',
              width: '125'
            }
          },
          {
            props: {
              label: '扣除比例（%）',
              prop: 'ADCE_RATIO',
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
                  on: { 'click': () => self.showEdit(row.ADCE_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: childEducateList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(ADCE_ID) {
      this.$refs['ref-child-educate-edit'].showDialog(ADCE_ID)
    }
  }
}
</script>
