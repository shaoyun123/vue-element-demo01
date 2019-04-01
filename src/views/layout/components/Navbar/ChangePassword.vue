<template>
  <el-dialog :visible.sync="dialogVisible" title="修改密码">
    <el-form-wrap ref="ref-form" :c-o-m="form" :loading="loading" />
    <typography-form-controller :controller="controller" />
  </el-dialog>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { showMessage } from '@/utils/element'
import ElFormWrap from '@/components/Typography/Wrap/elFormWrap'
import TypographyFormController from '@/components/Typography/Form/controller'

export default {
  name: 'ChangePassword',
  components: { ElFormWrap, TypographyFormController },
  data() {
    const self = this
    return {
      inputType: 'password',
      dialogVisible: false,
      loading: false,
      controller: {
        items: [
          {
            props: {
              icon: 'el-icon-antd-eye',
              circle: true
            },
            events: {
              click: self.changeInputType
            }
          },
          {
            float: 'right',
            text: '提  交',
            props: {
              icon: 'el-icon-antd-check'
            },
            events: {
              click: self.change
            }
          }
        ]
      }
    }
  },
  computed: {
    form: function() {
      const self = this
      return {
        props: {
          rules: {
            opwd: [
              { required: true, message: '请输入旧密码', trigger: 'blur' }
            ],
            npwd: [
              { required: true, message: '请输入新密码', trigger: 'blur' }
            ],
            cpwd: [
              { required: true, message: '请确认新密码', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  const model = self.$refs['ref-form'].getModel()
                  if (value !== model.npwd) {
                    callback(new Error('两次输入密码不一致'))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
          }
        },
        items: [
          {
            props: { label: '旧密码', prop: 'opwd' },
            items: [
              {
                tag: 'el-input',
                name: 'opwd',
                props: { type: this.inputType }
              }
            ]
          },
          { tag: 'el-new-row' },
          {
            props: { label: '新密码', prop: 'npwd' },
            items: [
              {
                tag: 'el-input',
                name: 'npwd',
                props: { type: this.inputType }
              }
            ]
          },
          {
            props: { label: '确认新密码', prop: 'cpwd' },
            items: [
              {
                tag: 'el-input',
                name: 'cpwd',
                props: { type: this.inputType }
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
      const ref = this.$refs['ref-form']
      if (isNotEmpty(ref)) {
        ref.ref().resetFields()
        ref.ref().clearValidate()
      }
    },
    hideDialog() {
      this.dialogVisible = false
    },
    changeInputType() {
      if (this.inputType === 'password') {
        this.inputType = ''
      } else {
        this.inputType = 'password'
      }
    },
    change() {
      const ref = this.$refs['ref-form']
      if (isNotEmpty(ref)) {
        ref.ref().validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('changePassword', ref.getModel()).then(() => {
              this.loading = false
              this.hideDialog()
            }).catch(messages => {
              this.loading = false
              showMessage({ data: messages, type: 'error' })
            })
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>
