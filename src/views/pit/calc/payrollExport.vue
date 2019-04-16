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
import TyFormBasic from '@/components/Typography/Form/Basic'

export default {
  name: 'PayrollExport',
  components: { TyFormBasic },
  data() {
    const self = this
    return {
      dialog: {
        props: { title: '导出发放单' }
      },
      controller: {
        showReset: false,
        items: [
          {
            float: 'right',
            text: '导  出',
            props: {
              icon: 'el-icon-antd-export',
              type: 'primary'
            },
            events: {
              click: self.export
            }
          }
        ]
      },
      P_ISSUE: moment().subtract(1, 'months').format('YYYY-MM'),
      loading: false
    }
  },
  computed: {
    form: function() {
      return {
        props: {
          model: { P_ISSUE: this.P_ISSUE }
        },
        items: [
          {
            props: {
              label: '期次号',
              prop: 'P_ISSUE',
              rules: [
                { required: true, message: '请选择期次号', trigger: 'blur' }
              ]
            },
            items: [
              {
                tag: 'el-date-picker',
                name: 'P_ISSUE',
                props: { type: 'month' }
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
    export() {
      this.$refs['ref'].validateForm().then(valid => {
        if (valid) {
          const model = this.$refs['ref'].getModel()
          this.P_ISSUE = model.P_ISSUE
          alert(this.P_ISSUE)
          this.$refs['ref'].hideDialog()
        }
      })
    }
  }
}
</script>
