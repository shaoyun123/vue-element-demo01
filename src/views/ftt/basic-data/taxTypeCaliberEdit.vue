<template>
  <basic-edit
    ref="ref"
    :dialog-title="dialogTitle"
    :default-model="defaultModel"
    :get-entity="getEntity"
    :save-entity="saveEntity"
    :handle-model="handleModel"
    :handle-items="handleItems"
    :actions="actions"
    :before-save="beforeSave"
    :after-save="afterSave" />
</template>

<script>
import moment from 'moment'
import { isNotEmpty } from '@/utils/validate'
import { taxTypeCaliberSingle, taxTypeCaliberSave } from '@/api/ftt'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'TaxTypeCaliberEdit',
  components: { BasicEdit },
  data() {
    const self = this
    return {
      dialogTitle: '口径',
      defaultModel: {
        TTC_DISTRICT: ['001', '001001'],
        TTC_BASISES: [],
        TTC_RATIO_CALCS: []
      },
      getEntity: taxTypeCaliberSingle,
      saveEntity: taxTypeCaliberSave,
      actions: [
        {
          tip: '添加计税依据项',
          props: {
            icon: 'el-icon-antd-filesearch',
            plain: true
          },
          events: {
            click: self.addBasis
          }
        },
        {
          tip: '添加税率认定项',
          props: {
            icon: 'el-icon-antd-percentage',
            plain: true
          },
          events: {
            click: self.addRatio
          }
        }
      ]
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { TTC_ID: PK }
        this.dialogTitle = '修改口径'
      } else {
        this.dialogTitle = '创建口径'
      }
      this.$refs['ref'].showDialog(primaryKey)
    },
    beforeSave(operate, model) {
      this.$emit('before-save', model)
    },
    afterSave(operate, model) {
      this.$emit('after-save', model)
    },
    handleModel(operate, model) {
      return model
    },
    handleItems(operate, model) {
      const self = this
      const items = []
      items.push({
        props: { label: '地区', prop: 'TTC_DISTRICT' },
        items: [
          {
            tag: 'el-cascader',
            name: 'TTC_DISTRICT',
            props: { options: this.$store.getters.getDistricts }
          }
        ]
      })
      items.push({
        props: {
          label: '生效日期',
          prop: 'TTC_DATE_START',
          rules: [
            { required: true, message: '请选择生效日期', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'TTC_DATE_START' }
        ]
      })
      items.push({
        props: {
          label: '失效日期',
          prop: 'TTC_DATE_END',
          rules: [
            { required: true, message: '请选择失效日期', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const TTC_DATE_START = _model.TTC_DATE_START
                const TTC_DATE_END = _model.TTC_DATE_END
                if (isNotEmpty(TTC_DATE_START) && isNotEmpty(TTC_DATE_END)) {
                  const dateStart = moment(TTC_DATE_START)
                  const dateEnd = moment(TTC_DATE_END)
                  if (dateStart.isBefore(dateEnd)) {
                    callback()
                  } else {
                    callback(new Error('失效日期不能小于或等于生效日期'))
                  }
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'TTC_DATE_END' }
        ]
      })
      items.push({ tag: 'el-new-group', title: '计税依据' })
      const basises = model.TTC_BASISES
      if (isNotEmpty(basises)) {
        basises.forEach((basis, i) => {
          const prefix = `TTC_BASISES.${i}.`
          items.push({
            tag: 'el-new-row',
            title: `第 ${i + 1} 组`,
            actions: [{ tip: '删除', icon: 'el-icon-antd-delete', click: () => self.delBasis(i) }]
          })
          items.push({
            props: {
              label: '键',
              prop: prefix + 'KEY',
              rules: [
                { required: true, message: '请输入键', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-input', name: prefix + 'KEY' }
            ]
          })
          items.push({
            props: {
              label: '标题',
              prop: prefix + 'TITLE',
              rules: [
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-input', name: prefix + 'TITLE' }
            ]
          })
          items.push({
            props: {
              label: '物理表名',
              prop: prefix + 'TABLE',
              rules: [
                { required: true, message: '请输入物理表名', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-input', name: prefix + 'TABLE' }
            ]
          })
          items.push({
            props: {
              label: '物理表字段',
              prop: prefix + 'FIELD',
              rules: [
                { required: true, message: '请输入物理表字段', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-input', name: prefix + 'FIELD' }
            ]
          })
        })
      }
      items.push({ tag: 'el-new-group', title: '税率认定' })
      const ratioCalcs = model.TTC_RATIO_CALCS
      if (isNotEmpty(ratioCalcs)) {
        ratioCalcs.forEach((ratioCalc, i) => {
          const prefix = `TTC_RATIO_CALCS.${i}.`
          items.push({
            tag: 'el-new-row',
            title: `第 ${i + 1} 组`,
            actions: [{ tip: '删除', icon: 'el-icon-antd-delete', click: () => self.delRatio(i) }]
          })
          items.push({
            props: {
              label: '税率',
              prop: prefix + 'VALUE',
              rules: [
                { required: true, message: '请输入税率', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-input', name: prefix + 'VALUE' }
            ]
          })
          items.push({
            props: {
              label: '标题',
              prop: prefix + 'TITLE',
              rules: [
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]
            },
            items: [
              { tag: 'el-input', name: prefix + 'TITLE' }
            ]
          })
          items.push({
            props: {
              label: '物理表字段',
              prop: prefix + 'SCRIPT',
              rules: [
                { required: true, message: '请输入物理表字段', trigger: 'blur' }
              ]
            },
            items: [
              {
                tag: 'el-input',
                name: prefix + 'SCRIPT',
                props: { type: 'textarea' }
              }
            ]
          })
        })
      }
      return items
    },
    validateDataRange(rule, value, callback) {
      const re = /^([0-9]+([.]{1}[0-9]+){0,1})(, [0-9]+([.]{1}[0-9]+){0,1})*$/
      if (!re.test(value)) {
        callback(new Error('请输入数字，多个数字间以 [, ] 号分隔，例：5, 7, 9'))
      } else {
        callback()
      }
    },
    addItem(field, value) {
      const ref = this.$refs['ref']
      if (isNotEmpty(ref)) {
        const model = ref.getModel()
        model[field].push(value)
        ref.handleDialogInput(model)
      }
    },
    delItem(field, index) {
      this.$confirm('是否删除此组数据 ？', {
        type: 'warning',
        confirmButtonClass: 'el-icon-antd-check',
        confirmButtonText: '是',
        showCancelButton: false
      }).then(() => {
        const ref = this.$refs['ref']
        if (isNotEmpty(ref)) {
          const model = ref.getModel()
          model[field].splice(index, 1)
          ref.handleDialogInput(model)
        }
      }).catch(() => {})
    },
    addBasis() {
      this.addItem('TTC_BASISES', { KEY: '', TITLE: '', TABLE: '', FIELD: '' })
    },
    delBasis(index) {
      this.delItem('TTC_BASISES', index)
    },
    addRatio() {
      this.addItem('TTC_RATIO_CALCS', { VALUE: '', TITLE: '', SCRIPT: '' })
    },
    delRatio(index) {
      this.delItem('TTC_RATIO_CALCS', index)
    }
  }
}
</script>
