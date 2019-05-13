<template>
  <basic-edit
    ref="ref"
    :form-title="formTitle"
    :default-model="defaultModel"
    :get-entity="getEntity"
    :save-entity="saveEntity"
    :handle-model="handleModel"
    :handle-items="handleItems"
    :before-save="beforeSave"
    :after-save="afterSave" />
</template>

<script>
import moment from 'moment'
import { isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { taxStairSingle, taxStairSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'TaxStairEdit',
  components: { BasicEdit },
  props: {
    PK: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formTitle: '所得税预扣率',
      defaultModel: {
        TSC_IS_RESIDENT: 'Y',
        TSC_INCOME_TYPE: '1',
        TSC_LEVEL: 1,
        TSC_AMOUNT: 0,
        TSC_RATIO: 0,
        TSC_QUICK_DEDUCTION: 0
      },
      getEntity: taxStairSingle,
      saveEntity: taxStairSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { TSC_ID: PK }
        this.formTitle = '修改所得税预扣率'
      } else {
        this.formTitle = '创建所得税预扣率'
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
      const items = []
      items.push({
        props: {
          label: '有效期',
          prop: 'TSC_EFFECTIVE_DATE',
          rules: [
            { required: true, message: '请选择有效期', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'TSC_EFFECTIVE_DATE' }
        ]
      })
      items.push({
        props: {
          label: '失效期',
          prop: 'TSC_EXPIRY_DATE',
          rules: [
            { required: true, message: '请选择失效期', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const TSC_EFFECTIVE_DATE = _model.TSC_EFFECTIVE_DATE
                const TSC_EXPIRY_DATE = _model.TSC_EXPIRY_DATE
                if (isNotEmpty(TSC_EFFECTIVE_DATE) && isNotEmpty(TSC_EXPIRY_DATE)) {
                  const effectiveDate = moment(TSC_EFFECTIVE_DATE)
                  const expiryDate = moment(TSC_EXPIRY_DATE)
                  if (effectiveDate.isBefore(expiryDate)) {
                    callback()
                  } else {
                    callback(new Error('失效期不能小于或等于有效期'))
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
          { tag: 'el-date-picker', name: 'TSC_EXPIRY_DATE' }
        ]
      })
      items.push({
        props: { label: '是否居民', prop: 'TSC_IS_RESIDENT' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'TSC_IS_RESIDENT')
      })
      items.push({
        props: { label: '所得类型', prop: 'TSC_INCOME_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'TSC_INCOME_TYPE',
            items: buildFormItemsByDicts('T1X_S3R_C4G_TSC_INCOME_TYPE', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '级数',
          prop: 'TSC_LEVEL',
          rules: [
            { required: true, message: '请输入级数', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input-number',
            name: 'TSC_LEVEL',
            props: { min: 1, precision: 0 }
          }
        ]
      })
      items.push({
        props: {
          label: '预扣预缴额度',
          prop: 'TSC_AMOUNT',
          rules: [
            { required: true, message: '请输入预扣预缴额度', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'TSC_AMOUNT' }
        ]
      })
      items.push({
        props: {
          label: '预扣率',
          prop: 'TSC_RATIO',
          rules: [
            { required: true, message: `请输入预扣率`, trigger: 'blur' },
            { validator: function(rule, value, callback) {
              const re = /^(0|[1-9]{1}[0-9]*)([.]{1}[0-9]+){0,1}$/
              if (!re.test(value)) {
                callback(new Error('请输入数字'))
              } else if (value < 0 || value > 100) {
                callback(new Error('有效的取值范围为 [0 - 100]'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input',
            name: 'TSC_RATIO',
            items: [
              {
                tag: 'i', props: { slot: 'append', class: 'el-icon-antd-percentage' }
              }
            ]
          }
        ]
      })
      items.push({
        props: {
          label: '速算扣除数',
          prop: 'TSC_QUICK_DEDUCTION',
          rules: [
            { required: true, message: '请输入速算扣除数', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'TSC_QUICK_DEDUCTION' }
        ]
      })
      return items
    }
  }
}
</script>
