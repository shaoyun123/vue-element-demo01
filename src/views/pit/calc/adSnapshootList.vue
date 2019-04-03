<template>
  <typography-table-dialog
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
import { adSnapshootList, adSnapshootUpdateById } from '@/api/pit'
import TypographyTableDialog from '@/components/Typography/Table/dialog'

export default {
  name: 'ADSnapshootList',
  components: { TypographyTableDialog },
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
        props: { title: '附加扣除' }
      },
      searcher: {
        items: [
          {
            props: { label: '类型', prop: 'ADS_TYPE' },
            items: [
              {
                tag: 'el-select',
                name: 'ADS_TYPE',
                items: buildFormItemsByDicts('A8L_D4T_S7T_ADS_TYPE', 'el-option')
              }
            ]
          },
          {
            props: { label: '校验状态', prop: 'ADS_VERIFY_STATUS' },
            items: [
              {
                tag: 'el-select',
                name: 'ADS_VERIFY_STATUS',
                items: buildFormItemsByDicts('A8L_D4T_S7T_ADS_VERIFY_STATUS', 'el-option')
              }
            ]
          }
        ]
      },
      table: {
        items: [
          {
            props: {
              label: '类型',
              prop: 'ADS_TYPE',
              fixed: 'left',
              width: '125',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('A8L_D4T_S7T_ADS_TYPE', cellValue)
              }
            }
          },
          {
            props: {
              label: '标题',
              prop: 'ADS_TITLE',
              fixed: 'left',
              width: '175'
            }
          },
          {
            props: {
              label: '校验状态',
              prop: 'ADS_VERIFY_STATUS',
              fixed: 'left',
              align: 'center',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                const title = self.$store.getters.getDictTitle('A8L_D4T_S7T_ADS_VERIFY_STATUS', cellValue)
                if (cellValue === '03') {
                  const jsxData = {
                    on: { 'click': () => self.showMessage('处理结果', row.ADS_DISPOSE_DESCR) }
                  }
                  return [<el-button type='text' { ...jsxData }>{title}</el-button>]
                } else if (cellValue === '04') {
                  const jsxData = {
                    on: { 'click': () => self.showMessage('校验结果', row.ADS_RESULT) }
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
              label: '扣除额度',
              prop: 'ADS_AMOUNT',
              width: '100'
            }
          },
          {
            props: {
              label: '本年度累计已扣',
              prop: 'ADS_AT_ALREADY',
              width: '125'
            }
          },
          {
            props: {
              label: '本年度累计应扣',
              prop: 'ADS_AT_SHOULD',
              width: '125'
            }
          },
          {
            props: {
              label: '描述',
              prop: 'ADS_DESCR',
              width: '750',
              'show-overflow-tooltip': true
            }
          },
          {
            props: { prop: 'fill' }
          }
        ]
      },
      paginationMethod: adSnapshootList,
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
          text: '调平',
          props: {
            icon: 'el-icon-antd-control',
            type: 'warning',
            plain: true
          },
          events: {
            click: function() {
              const selectedRows = self.$refs['ref'].ref().selectedRows
              if (isNotEmpty(selectedRows)) {
                self.$confirm('是否调平数据 ？', {
                  type: 'warning',
                  confirmButtonClass: 'el-icon-antd-check',
                  confirmButtonText: '是',
                  showCancelButton: false
                }).then(() => {
                  let count = 0
                  const adSnapshoots = []
                  selectedRows.forEach(selectedRow => {
                    const ADS_VERIFY_STATUS = selectedRow.ADS_VERIFY_STATUS
                    if (ADS_VERIFY_STATUS === '04') {
                      adSnapshoots.push({
                        ADS_FREQ: selectedRow.ADS_FREQ,
                        ADS_ISSUE: selectedRow.ADS_ISSUE,
                        ADS_STAFF_NUMBER: selectedRow.ADS_STAFF_NUMBER,
                        ADS_VERIFY_STATUS: '03',
                        ADS_DISPOSE_DESCR: '已对数据进行调平处理'
                      })
                    } else {
                      count++
                    }
                  })
                  adSnapshootUpdateById(adSnapshoots).then(response => {
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
        items.push({
          selectedRowVisible: true,
          text: '忽略',
          props: {
            icon: 'el-icon-antd-stop',
            type: 'warning',
            plain: true
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
                  const adSnapshoots = []
                  selectedRows.forEach(selectedRow => {
                    const ADS_VERIFY_STATUS = selectedRow.ADS_VERIFY_STATUS
                    if (ADS_VERIFY_STATUS === '04') {
                      adSnapshoots.push({
                        ADS_FREQ: selectedRow.ADS_FREQ,
                        ADS_ISSUE: selectedRow.ADS_ISSUE,
                        ADS_STAFF_NUMBER: selectedRow.ADS_STAFF_NUMBER,
                        ADS_VERIFY_STATUS: '03',
                        ADS_DISPOSE_DESCR: value
                      })
                    } else {
                      count++
                    }
                  })
                  adSnapshootUpdateById(adSnapshoots).then(response => {
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
