<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <adult-educate-edit ref="ref-adult-educate-edit" @after-save="refresh" />
  </div>
</template>

<script>
import * as validator from '@/utils/validate'
import { adultEducateList, adultEducateDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import AdultEducateEdit from './adultEducateEdit'

export default {
  name: 'AdultEducateList',
  components: { TypographyTableBasic, AdultEducateEdit },
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
                    const ADAE_IDS = selectedRows.map(selectedRow => selectedRow.ADAE_ID)
                    adultEducateDelete(ADAE_IDS).then(response => {
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
              label: '继续教育类型',
              prop: 'ADAE_EDUCATE_TYPE',
              fixed: 'left',
              width: '200',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('AD_A3T_E5E_ADAE_EDUCATE_TYPE', cellValue)
              }
            }
          },
          {
            props: {
              label: '继续教育阶段',
              prop: 'ADAE_EDUCATE_STAGE',
              fixed: 'left',
              width: '125',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('EDUCATION', cellValue)
              }
            }
          },
          {
            props: {
              label: '起始时间',
              prop: 'ADAE_STAGE_START',
              fixed: 'left',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '结束时间',
              prop: 'ADAE_STAGE_END',
              fixed: 'left',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '发证（批准）日期',
              prop: 'ADAE_CERTIFICATE_DATE',
              align: 'center',
              width: '150'
            }
          },
          {
            props: {
              label: '证书名称',
              prop: 'ADAE_CERTIFICATE_NAME',
              width: '350'
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
                  on: { 'click': () => self.showEdit(row.ADAE_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: adultEducateList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(ADAE_ID) {
      this.$refs['ref-adult-educate-edit'].showDialog(ADAE_ID)
    }
  }
}
</script>
