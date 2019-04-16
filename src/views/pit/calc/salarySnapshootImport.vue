<template>
  <ty-form-basic
    ref="ref"
    :dialog="dialog"
    :form="form"
    :loading="loading"
    :controller="controller" />
</template>

<script>
import moment from 'moment'
import { isNotEmpty } from '@/utils/validate'
import { salarySnapshootImport } from '@/api/pit'
import TyFormBasic from '@/components/Typography/Form/Basic'
import { buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'

export default {
  name: 'SalarySnapshootImport',
  components: { TyFormBasic },
  data() {
    const self = this
    return {
      dialog: {
        props: { title: '薪金批量采集' }
      },
      controller: {
        showReset: false,
        items: [
          {
            float: 'left',
            text: '下载模板',
            props: {
              icon: 'el-icon-antd-table'
            },
            events: {
              click: self.downloadTemplate
            }
          },
          {
            float: 'right',
            text: '导  入',
            props: {
              icon: 'el-icon-antd-Import',
              type: 'primary'
            },
            events: {
              click: self.import
            }
          }
        ]
      },
      importModes: [
        { value: '01', title: '自动' },
        { value: '02', title: '覆盖' },
        { value: '03', title: '调整' }
      ],
      model: {
        SS_FREQ: 'M',
        SS_ISSUE: moment().subtract(1, 'months').format('YYYY-MM'),
        SS_TYPE: '01',
        SS_PREDICT_PAY_DATE: moment().add(10, 'days').format('YYYY-MM-DD'),
        SS_IMPORT_MODE: '01',
        SS_FILE: null
      },
      loading: false
    }
  },
  computed: {
    form: function() {
      const self = this
      return {
        props: {
          model: self.model
        },
        items: [
          {
            props: { label: '频度', prop: 'SS_FREQ' },
            items: buildFormItemsByDicts('S4Y_S7T_SS_FREQ', 'el-radio', 'SS_FREQ')
          },
          {
            props: {
              label: '期次号',
              prop: 'SS_ISSUE',
              rules: [
                { required: true, message: '请选择期次号', trigger: 'blur' }
              ]
            },
            items: [
              {
                tag: 'el-date-picker',
                name: 'SS_ISSUE',
                props: { type: 'month' }
              }
            ]
          },
          {
            props: { label: '薪金类型', prop: 'SS_TYPE' },
            items: buildFormItemsByDicts('S4Y_S7T_SS_TYPE', 'el-radio', 'SS_TYPE')
          },
          {
            props: {
              label: '预计发放日期',
              prop: 'SS_PREDICT_PAY_DATE',
              rules: [
                { required: true, message: '请选择预计发放日期', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-date-picker', name: 'SS_PREDICT_PAY_DATE' }
            ]
          },
          {
            tip: `
              自动模式：遇到已存在的数据跳过<p>
              覆盖模式：遇到已存在的数据覆盖<p>
              调整模式：遇到已存在的数据合并<p>
              <span style="color: #f56c6c;">*</span> 导入只会对 [待处理、打回、待调整] 三种状态的数据造成影响
            `,
            props: { label: '导入模式', prop: 'SS_IMPORT_MODE' },
            items: buildFormItems(self.importModes, 'value', 'title', 'el-radio', 'SS_IMPORT_MODE')
          },
          { tag: 'el-new-row' },
          {
            props: {
              label: '数据文件',
              prop: 'SS_FILE',
              rules: [
                { required: true, message: '请选择数据文件', trigger: 'blur' },
                {
                  validator: (rule, value, callback) => {
                    const type = value.TYPE
                    const size = value.SIZE
                    const messages = []
                    if (
                      type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                      type !== 'application/vnd.ms-excel'
                    ) {
                      messages.push('请选择 xls、xls 类型的文件')
                    }
                    if (size > 10) {
                      messages.push('文件大小应小于 10 M')
                    }
                    if (isNotEmpty(messages)) {
                      let message = ''
                      messages.forEach((text, i) => {
                        if (i > 0) {
                          message += ', '
                        }
                        message += text
                      })
                      callback(new Error(message))
                    } else {
                      callback()
                    }
                  },
                  trigger: 'blur'
                }
              ]
            },
            items: [
              {
                tag: 'el-upload',
                props: {
                  action: '', // 必填，使用 base64 处理文件，通过表单提交文件
                  'auto-upload': false,
                  accept: '.xls,.xlsx',
                  limit: 1,
                  'on-exceed': function(files, fileList) {
                    this.$message({
                      showClose: true,
                      message: '如果需要重新选择数据文件，请先将已选中文件的删除',
                      type: 'warning'
                    })
                  },
                  'on-change': function(file, fileList) {
                    const raw = file.raw
                    const name = raw.name
                    const type = raw.type // [xlsx > application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | xls > application/vnd.ms-excel]
                    const size = raw.size / 1024 / 1024 // M
                    const reader = new FileReader()
                    reader.readAsDataURL(raw)
                    reader.onload = function(event) {
                      self.model.SS_FILE = { NAME: name, TYPE: type, SIZE: size, BODY: this.result }
                    }
                  }
                },
                items: [
                  {
                    tag: 'el-button',
                    text: '选取文件',
                    props: { slot: 'trigger', type: 'primary', plain: true }
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    showDialog() {
      this.$refs['ref'].showDialog()
    },
    downloadTemplate() {
      alert('downloadTemplate')
    },
    import() {
      this.$refs['ref'].validateForm().then(valid => {
        if (valid) {
          const model = this.$refs['ref'].getModel()
          salarySnapshootImport(model).then(response => {
            this.model = model
            this.$refs['ref'].hideDialog()
            this.$emit('after-save')
          })
        }
      })
    }
  }
}
</script>
