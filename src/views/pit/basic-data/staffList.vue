<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <enterprise-edit ref="ref-enterprise-edit" @after-save="refresh" />
  </div>
</template>

<script>
import * as validator from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { enterpriseList, enterpriseDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import EnterpriseEdit from './enterpriseEdit'

export default {
  name: 'EnterpriseList',
  components: { TypographyTableBasic, EnterpriseEdit },
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
                if (validator.isNotEmpty(selectedRows)) {
                  self.$confirm('是否删除数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const E_IDS = selectedRows.map(selectedRow => selectedRow.E_ID)
                    enterpriseDelete(E_IDS).then(response => {
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
            props: { label: '企业名', prop: 'E_NAME' },
            items: [
              { tag: 'el-input', name: 'E_NAME' }
            ]
          },
          {
            props: { label: '纳税人识别号', prop: 'E_TAX_ID_NUMBER' },
            items: [
              { tag: 'el-input', name: 'E_TAX_ID_NUMBER' }
            ]
          },
          {
            props: { label: '企业性质', prop: 'E_TYPE' },
            items: buildFormItemsByDicts('E8E_E_TYPE', 'el-radio', 'E_TYPE')
          }
        ]
      },
      table: {
        items: [
          {
            props: {
              label: '企业名',
              prop: 'E_NAME',
              fixed: 'left',
              width: '350'
            }
          },
          {
            props: {
              label: '纳税人识别号',
              prop: 'E_TAX_ID_NUMBER',
              width: '250'
            }
          },
          {
            props: {
              label: '企业性质',
              prop: 'E_TYPE',
              align: 'center',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('E8E_E_TYPE', cellValue)
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
                const jsxData = {
                  on: { 'click': () => self.showEdit(row.E_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: enterpriseList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(E_ID) {
      this.$refs['ref-enterprise-edit'].showDialog(E_ID)
    }
  }
}
</script>
