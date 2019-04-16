<template>
  <div>
    <ty-table-dialog
      ref="ref"
      :dialog="dialog"
      :controller="controller"
      :searcher="searcher"
      :table="table"
      :pagination-method="paginationMethod"
      @after-close="afterClose" />
    <tax-type-caliber-edit ref="ref-tax-type-caliber-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { taxTypeCaliberList } from '@/api/ftt'
import TyTableDialog from '@/components/Typography/Table/Dialog'
import TaxTypeCaliberEdit from './taxTypeCaliberEdit'

export default {
  name: 'TaxTypeCaliberList',
  components: { TyTableDialog, TaxTypeCaliberEdit },
  data() {
    const self = this
    return {
      dialog: {
        props: { title: '税种口径' }
      },
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
          }
        ]
      },
      searcher: {
        items: [
          {
            props: { label: '地区', prop: 'TTC_DISTRICT' },
            items: [
              {
                tag: 'el-cascader',
                name: 'TTC_DISTRICT',
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
              label: '地区',
              prop: 'TTC_DISTRICT',
              fixed: 'left',
              width: '150',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDistrictTitle(cellValue[cellValue.length - 1])
              }
            }
          },
          {
            props: {
              label: '生效日期',
              prop: 'TTC_DATE_START',
              fixed: 'left',
              align: 'center',
              width: '100'
            }
          },
          {
            props: {
              label: '失效日期',
              prop: 'TTC_DATE_END',
              fixed: 'left',
              align: 'center',
              width: '100'
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
                  on: { 'click': () => self.showEdit(row.TTC_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: taxTypeCaliberList,
      extraParams: {}
    }
  },
  methods: {
    showDialog(PK) {
      this.$refs['ref'].showDialog()
      if (JSON.stringify(PK) !== JSON.stringify(this.extraParams)) {
        this.extraParams = { TTC_TAX_TYPE_ID: PK }
        this.$refs['ref'].clearSearcher()
      }
      this.searcher = Object.assign({}, this.searcher, { extraParams: this.extraParams })
    },
    refresh() {
      this.$refs['ref'].ref().doSearch()
    },
    afterClose(config) {
      this.$emit('after-close', config)
    },
    showEdit(TTC_ID) {
      this.$refs['ref-tax-type-caliber-edit'].showDialog(TTC_ID)
    }
  }
}
</script>
