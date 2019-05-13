<template>
  <div>
    <ty-table-category
      ref="ref"
      :category-controller="categoryController"
      :category-tree="categoryTree"
      :linkage-method="linkageMethod"
      :controller="controller"
      :searcher="searcher"
      :table="table"
      :pagination-method="paginationMethod" />
    <tax-type-edit ref="ref-tax-type-edit" @after-save="refresh" />
    <tax-type-caliber-edit ref="ref-tax-type-caliber-edit" @after-save="refresh" />
  </div>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { taxTypeList, taxTypeDelete, taxTypeCaliberList } from '@/api/ftt'
import TyTableCategory from '@/components/Typography/Table/Category'
import TaxTypeEdit from './taxTypeEdit'
import TaxTypeCaliberEdit from './taxTypeCaliberEdit'

export default {
  name: 'TaxTypeList',
  components: { TyTableCategory, TaxTypeEdit, TaxTypeCaliberEdit },
  data() {
    const self = this
    return {
      categoryController: {
        items: [
          {
            text: '新增', props: { icon: 'el-icon-antd-plus' },
            events: {
              click: () => self.showEdit('')
            }
          },
          {
            selectedRowVisible: true,
            text: '删除',
            props: { icon: 'el-icon-antd-delete', type: 'danger' },
            events: {
              click: function() {
                const checkedNodes = self.ref().refCategory().checkedNodes
                if (isNotEmpty(checkedNodes)) {
                  self.$confirm('是否删除数据 ？', {
                    type: 'warning',
                    confirmButtonClass: 'el-icon-antd-check',
                    confirmButtonText: '是',
                    showCancelButton: false
                  }).then(() => {
                    const pks = checkedNodes.map(checkedNode => {
                      return checkedNode.TT_ID
                    })
                    taxTypeDelete(pks).then(response => {
                      self.ref().refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          }
        ]
      },
      categoryTree: {
        props: {
          'node-key': 'TT_ID',
          props: {
            label: function(data, node) {
              return data.TT_NAME + ` [${data.TT_ID}]`
            },
            isLeaf: function(data, node) {
              return true
            }
          },
          lazy: true,
          load: (node, resolve) => {
            taxTypeList({}).then(response => {
              resolve(response.data.items)
            })
          }
        },
        menu: {
          command: (command, data) => {
            if (command === 'edit') {
              self.showEdit(data.TT_ID)
            } else if (command === 'delete') {
              taxTypeDelete([data.TT_ID]).then(response => {
                self.ref().refresh()
              })
            }
          },
          items: [
            {
              text: '编辑', props: { command: 'edit', icon: 'el-icon-antd-edit' }
            },
            {
              text: '删除', props: { command: 'delete', icon: 'el-icon-antd-delete' }
            }
          ]
        }
      },
      linkageMethod: (data, node) => {
        return { TTC_TAX_TYPE_ID: data.TT_ID }
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
                self.showTaxTypeCaliberEdit('')
              }
            }
          }
        ]
      },
      searcher: {
        extraParams: { TTC_TAX_TYPE_ID: '_empty_' },
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
                  on: { 'click': () => self.showTaxTypeCaliberEdit(row.TTC_ID) }
                }
                return [<el-button type='text' { ...jsxData }>编辑</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: taxTypeCaliberList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(TT_ID) {
      this.$refs['ref-tax-type-edit'].showDialog(TT_ID)
    },
    showTaxTypeCaliberEdit(TTC_ID) {
      this.$refs['ref-tax-type-caliber-edit'].showDialog(TTC_ID)
    },
    ref() {
      return this.$refs.ref
    }
  }
}
</script>
