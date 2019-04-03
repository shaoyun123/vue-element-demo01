<template>
  <ty-table-dialog
    ref="ref"
    :dialog="dialog"
    :controller="controller"
    :searcher="searcher"
    :table="table"
    :pagination-method="paginationMethod" />
</template>

<script>
import { isEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { flowRecordList } from '@/api/pit'
import TyTableDialog from '@/components/Typography/Table/dialog'

export default {
  name: 'FlowRecordList',
  components: { TyTableDialog },
  data() {
    // const self = this
    return {
      dialog: {
        props: { title: '流转记录' }
      },
      controller: { items: [] },
      searcher: {
        items: [
          {
            props: { label: '校验状态', prop: 'VR_STATUS' },
            items: [
              {
                tag: 'el-select',
                name: 'VR_STATUS',
                items: buildFormItemsByDicts('V4Y_R4T_VR_STATUS', 'el-option')
              }
            ]
          }
        ]
      },
      table: {
        items: [
          {
            props: {
              label: '操作人',
              prop: 'FR_OPERATOR_NAME',
              fixed: 'left',
              width: '125'
            }
          },
          {
            props: {
              label: '操作时间',
              prop: 'FR_OPERATE_TIME',
              fixed: 'left',
              align: 'center',
              width: '150'
            }
          },
          {
            props: {
              label: '操作',
              prop: 'FR_OPERATE_TITLE',
              fixed: 'left',
              width: '125'
            }
          },
          {
            props: {
              label: '操作前状态',
              prop: 'FR_OPERATE_SB_TITLE',
              fixed: 'left',
              width: '125'
            }
          },
          {
            props: {
              label: '操作后状态',
              prop: 'FR_OPERATE_SA_TITLE',
              fixed: 'left',
              width: '125'
            }
          },
          {
            props: {
              label: '操作描述',
              prop: 'FR_OPERATE_DESCR',
              width: '500',
              'show-overflow-tooltip': true,
              formatter: function(row, column, cellValue, index) {
                if (isEmpty(cellValue)) {
                  return <span />
                } else {
                  return <span>{ cellValue }</span>
                }
              }
            }
          },
          {
            props: {
              label: '备注',
              prop: 'FR_REMARK',
              width: '250',
              'show-overflow-tooltip': true,
              formatter: function(row, column, cellValue, index) {
                if (isEmpty(cellValue)) {
                  return <span />
                } else {
                  return <span>{ cellValue }</span>
                }
              }
            }
          },
          {
            props: { prop: 'fill' }
          }
        ]
      },
      paginationMethod: flowRecordList,
      extraParams: {}
    }
  },
  methods: {
    showDialog(PK) {
      this.$refs['ref'].showDialog()
      if (JSON.stringify(PK) !== JSON.stringify(this.extraParams)) {
        this.extraParams = PK
        this.$refs['ref'].clearSearcher()
      }
      this.searcher = Object.assign({}, this.searcher, { extraParams: PK })
    },
    showMessage(title, message) {
      this.$alert(message, title, {
        showConfirmButton: false,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        callback: function() {}
      })
    }
  }
}
</script>
