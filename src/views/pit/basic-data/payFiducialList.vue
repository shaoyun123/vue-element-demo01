<template>
  <div>
    <typography-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <pay-fiducial-edit ref="ref-pay-fiducial-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { payFiducialList, payFiducialDelete } from '@/api/pit'
import TypographyTableBasic from '@/components/Typography/Table/basic'
import PayFiducialEdit from './payFiducialEdit'

export default {
  name: 'TaxStairList',
  components: { TypographyTableBasic, PayFiducialEdit },
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
                    const fiducials = selectedRows.map(selectedRow => {
                      return {
                        PFC_PAY_SITE: selectedRow.PFC_PAY_SITE,
                        PFC_YEAR: selectedRow.PFC_YEAR
                      }
                    })
                    payFiducialDelete(fiducials).then(response => {
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
            props: { label: '缴纳地', prop: 'PFC_PAY_SITE' },
            items: [
              {
                tag: 'el-cascader',
                name: 'PFC_PAY_SITE',
                props: { options: this.$store.getters.getDistricts }
              }
            ]
          },
          {
            props: { label: '年度', prop: 'PFC_YEAR' },
            items: [
              {
                tag: 'el-date-picker',
                name: 'PFC_YEAR',
                props: { type: 'year' }
              }
            ]
          }
        ]
      },
      table: {
        items: [
          {
            props: {
              label: '年度',
              prop: 'PFC_YEAR',
              fixed: 'left',
              align: 'center',
              width: '75'
            }
          },
          {
            props: {
              label: '缴纳地',
              prop: 'PFC_PAY_SITE',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDistrictTitle(cellValue[cellValue.length - 1])
              }
            }
          },
          {
            props: {
              label: '养老缴纳基数',
              prop: 'PFC_PENSION',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return `[${row.PFC_PENSION_MIN} - ${row.PFC_PENSION_MAX}]`
              }
            }
          },
          {
            props: {
              label: '医疗缴纳基数',
              prop: 'PFC_MEDICAL',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return `[${row.PFC_MEDICAL_MIN} - ${row.PFC_MEDICAL_MAX}]`
              }
            }
          },
          {
            props: {
              label: '失业缴纳基数',
              prop: 'PFC_UNEMPLOYMENT',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return `[${row.PFC_UNEMPLOYMENT_MIN} - ${row.PFC_UNEMPLOYMENT_MAX}]`
              }
            }
          },
          {
            props: {
              label: '生育缴纳基数',
              prop: 'PFC_PROCREATION',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return `[${row.PFC_PROCREATION_MIN} - ${row.PFC_PROCREATION_MAX}]`
              }
            }
          },
          {
            props: {
              label: '工伤缴纳基数',
              prop: 'PFC_INJURY',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return `[${row.PFC_INJURY_MIN} - ${row.PFC_INJURY_MAX}]`
              }
            }
          },
          {
            props: {
              label: '公积金缴纳基数',
              prop: 'PFC_CR_FUND',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return `[${row.PFC_CR_FUND_MIN} - ${row.PFC_CR_FUND_MAX}]`
              }
            }
          },
          {
            props: {
              label: '公积金补充缴纳基数',
              prop: 'PFC_CR_FUND_S',
              width: '175',
              formatter: function(row, column, cellValue, index) {
                return `[${row.PFC_CR_FUND_S_MIN} - ${row.PFC_CR_FUND_S_MAX}]`
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
                const fiducial = {
                  PFC_PAY_SITE: row.PFC_PAY_SITE,
                  PFC_YEAR: row.PFC_YEAR
                }
                const jsxData = {
                  on: { 'click': () => self.showEdit(fiducial) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: payFiducialList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(fiducial) {
      this.$refs['ref-pay-fiducial-edit'].showDialog(fiducial)
    }
  }
}
</script>
