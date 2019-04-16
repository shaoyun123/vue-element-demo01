<template>
  <ty-table-dialog
    ref="ref"
    :dialog="dialog"
    :controller="controller"
    :searcher="searcher"
    :table="table"
    :pagination-method="paginationMethod"
    @after-close="afterClose" />
</template>

<script>
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { verifyResultList, verifyResultUpdateById } from '@/api/pit'
import TyTableDialog from '@/components/Typography/Table/Dialog'

export default {
  name: 'VerifyResultList',
  components: { TyTableDialog },
  props: {
    operate: {
      type: String,
      default: 'view' // edit | view
    }
  },
  data() {
    const self = this
    return {
      dialog: {
        props: { title: '校验结果' }
      },
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
              label: '规则标题',
              prop: 'VR_RULE_TITLE',
              fixed: 'left',
              width: '175'
            }
          },
          {
            props: {
              label: '状态',
              prop: 'VR_STATUS',
              fixed: 'left',
              align: 'center',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                const title = self.$store.getters.getDictTitle('V4Y_R4T_VR_STATUS', cellValue)
                if (cellValue === '03') {
                  const jsxData = {
                    on: { 'click': () => self.showMessage('处理结果', row.VR_DISPOSE_DESCR) }
                  }
                  return [<el-button type='text' { ...jsxData }>{title}</el-button>]
                } else if (cellValue === '02') {
                  const jsxData = {
                    on: { 'click': () => self.showMessage('校验结果', row.VR_RESULT) }
                  }
                  return [<el-button type='text' { ...jsxData }>{title}</el-button>]
                } else {
                  return title
                }
              }
            }
          },
          {
            props: {
              label: '规则描述',
              prop: 'VR_RULE_DESCR',
              width: '750',
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
      paginationMethod: verifyResultList,
      extraParams: {}
    }
  },
  computed: {
    controller: function() {
      return { items: this.getControllerItems() }
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
    refresh() {
      this.$refs['ref'].ref().doSearch()
    },
    getControllerItems() {
      const self = this
      const items = []
      if (self.operate === 'edit') {
        items.push({
          selectedRowVisible: true,
          text: '忽略',
          props: {
            icon: 'el-icon-antd-stop',
            type: 'warning'
          },
          events: {
            click: function() {
              const selectedRows = self.$refs['ref'].ref().selectedRows
              if (isNotEmpty(selectedRows)) {
                self.$prompt('请输入忽略原因', '忽略', {
                  confirmButtonClass: 'el-icon-antd-check',
                  confirmButtonText: '提交',
                  showCancelButton: false,
                  inputValidator: (value) => {
                    if (isEmpty(value)) {
                      return '请输入忽略原因'
                    }
                    return true
                  }
                }).then(({ value }) => {
                  let count = 0
                  const verifyResults = []
                  selectedRows.forEach(selectedRow => {
                    const VR_STATUS = selectedRow.VR_STATUS
                    if (VR_STATUS === '02') {
                      verifyResults.push({
                        VR_ID: selectedRow.VR_ID,
                        VR_STATUS: '03',
                        VR_DISPOSE_DESCR: value
                      })
                    } else {
                      count++
                    }
                  })
                  verifyResultUpdateById(verifyResults).then(response => {
                    if (count !== 0) {
                      self.$message({
                        showClose: true,
                        message: `有 ${count} 条数据已处理，系统已自动剔除`,
                        type: 'warning'
                      })
                    }
                    self.refresh()
                  })
                }).catch(() => {})
              }
            }
          }
        })
      }
      return items
    },
    showMessage(title, message) {
      this.$alert(message, title, {
        showConfirmButton: false,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        callback: function() {}
      })
    },
    afterClose(config) {
      this.$emit('after-close', config)
    }
  }
}
</script>
