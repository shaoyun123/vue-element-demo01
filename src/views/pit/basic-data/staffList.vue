<template>
  <div>
    <ty-table-basic ref="ref" :controller="controller" :searcher="searcher" :table="table" :pagination-method="paginationMethod" />
    <staff-edit ref="ref-staff-edit" @after-save="refresh" />
    <salary-edit ref="ref-salary-edit" />
  </div>
</template>

<script>
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { staffList, staffDelete, loginIdSave } from '@/api/pit'
import TyTableBasic from '@/components/Typography/Table/Basic'
import StaffEdit from './staffEdit'
import SalaryEdit from './salaryEdit'

export default {
  name: 'StaffList',
  components: { TyTableBasic, StaffEdit, SalaryEdit },
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
                    const S_NUMBERS = selectedRows.map(selectedRow => selectedRow.S_NUMBER)
                    staffDelete(S_NUMBERS).then(response => {
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
            props: { label: '员工号', prop: 'S_NUMBER' },
            items: [
              { tag: 'el-input', name: 'S_NUMBER' }
            ]
          },
          {
            props: { label: '登录名', prop: 'S_LOGIN_ID' },
            items: [
              { tag: 'el-input', name: 'S_LOGIN_ID' }
            ]
          },
          {
            props: { label: '姓名', prop: 'S_NAME' },
            items: [
              { tag: 'el-input', name: 'S_NAME' }
            ]
          },
          {
            props: { label: '身份证件号码', prop: 'S_ID_NUMBER' },
            items: [
              { tag: 'el-input', name: 'S_ID_NUMBER' }
            ]
          },
          {
            props: { label: '人员状态', prop: 'S_STATUS' },
            items: buildFormItemsByDicts('S3F_S_STATUS', 'el-radio', 'S_STATUS')
          },
          {
            props: { label: '是否雇员', prop: 'S_IS_STAFF' },
            items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_STAFF')
          }
        ]
      },
      table: {
        items: [
          {
            props: {
              label: '员工号',
              prop: 'S_NUMBER',
              fixed: 'left',
              width: '150'
            }
          },
          {
            props: {
              label: '登录名',
              prop: 'S_LOGIN_ID',
              fixed: 'left',
              width: '150',
              formatter: function(row, column, cellValue, index) {
                if (isEmpty(cellValue)) {
                  const jsxData = {
                    on: { 'click': () => self.bindLoginId(row.S_NUMBER) }
                  }
                  return [<el-button type='text' { ...jsxData }>绑定</el-button>]
                } else {
                  return self.$store.getters.getDictTitle('E8S_S_TYPE', cellValue)
                }
              }
            }
          },
          {
            props: {
              label: '姓名',
              prop: 'S_NAME',
              fixed: 'left',
              width: '150'
            }
          },
          {
            props: {
              label: '性别',
              prop: 'S_GENDER',
              width: '50',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('GENDER', cellValue)
              }
            }
          },
          {
            props: {
              label: '人员状态',
              prop: 'S_STATUS',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('S3F_S_STATUS', cellValue)
              }
            }
          },
          {
            props: {
              label: '是否雇员',
              prop: 'S_IS_STAFF',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('YN', cellValue)
              }
            }
          },
          {
            props: {
              label: '验证状态',
              prop: 'S_VERIFY_STATUS',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('S3F_S_VERIFY_STATUS', cellValue)
              }
            }
          },
          {
            props: {
              label: '报备状态',
              prop: 'S_RECORD_STATUS',
              width: '100',
              formatter: function(row, column, cellValue, index) {
                return self.$store.getters.getDictTitle('S3F_S_RECORD_STATUS', cellValue)
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
                const ejData = {
                  on: { 'click': () => self.showEdit(row.S_NUMBER) }
                }
                const sjData = {
                  on: { 'click': () => self.showSalary(row.S_NUMBER, '01') }
                }
                return [<el-button type='text' { ...ejData }>编辑</el-button>, <el-button type='text' { ...sjData }>月薪</el-button>]
              }
            }
          }
        ]
      },
      paginationMethod: staffList
    }
  },
  methods: {
    refresh() {
      this.$refs['ref'].doSearch()
    },
    showEdit(S_NUMBER) {
      this.$refs['ref-staff-edit'].showDialog(S_NUMBER)
    },
    showSalary(S_STAFF_NUMBER, S_TYPE) {
      this.$refs['ref-salary-edit'].showDialog({ S_STAFF_NUMBER, S_TYPE })
    },
    bindLoginId(S_NUMBER) {
      const self = this
      self.$prompt('请输入登录名', '绑定登录名', {
        confirmButtonClass: 'el-icon-antd-check',
        confirmButtonText: '提交',
        showCancelButton: false,
        inputValidator: (value) => {
          if (isEmpty(value)) {
            return '请输入登录名'
          }
          return true
        }
      }).then(({ value }) => {
        loginIdSave({ S_NUMBER, S_LOGIN_ID: value }).then(response => {
          self.refresh()
        })
      }).catch(() => {})
    }
  }
}
</script>
