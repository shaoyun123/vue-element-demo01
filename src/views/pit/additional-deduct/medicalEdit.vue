<template>
  <basic-edit
    ref="ref"
    :dialog-title="dialogTitle"
    :default-model="defaultModel"
    :get-entity="getEntity"
    :save-entity="saveEntity"
    :handle-model="handleModel"
    :handle-items="handleItems"
    :before-save="beforeSave"
    :after-save="afterSave" />
</template>

<script>
import * as validator from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { medicalSingle, medicalSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'MedicalEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '大病医疗',
      defaultModel: {
        ADM_RELATION: '1',
        ADM_ID_TYPE: '01',
        ADM_MEDICAL_EXPENSE: 0
      },
      getEntity: medicalSingle,
      saveEntity: medicalSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (validator.isNotEmpty(PK)) {
        primaryKey = { ADM_ID: PK }
        this.dialogTitle = '修改大病医疗'
      } else {
        this.dialogTitle = '创建大病医疗'
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
        props: { label: '关系', prop: 'ADM_RELATION' },
        items: buildFormItemsByDicts('AD_M5L_ADM_RELATION', 'el-radio', 'ADM_RELATION')
      })
      items.push({
        props: {
          label: '姓名',
          prop: 'ADM_NAME',
          rules: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADM_NAME' }
        ]
      })
      items.push({
        props: { label: '身份证件类型', prop: 'ADM_ID_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADM_ID_TYPE',
            items: buildFormItemsByDicts('ID_TYPE', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '身份证件号码',
          prop: 'ADM_ID_NUMBER',
          rules: [
            { required: true, message: '请输入身份证件号码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (model.ADM_ID_TYPE === '01') {
                  if (validator.validateIDNumber(value)) {
                    callback()
                  } else {
                    callback(new Error('居民身份证号格式错误'))
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
          { tag: 'el-input', name: 'ADM_ID_NUMBER' }
        ]
      })
      items.push({
        props: {
          label: '医药费用总金额',
          prop: 'ADM_MEDICAL_EXPENSE',
          rules: [
            { required: true, message: '请输入医药费用总金额', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input-number', name: 'ADM_MEDICAL_EXPENSE' }
        ]
      })
      return items
    }
  }
}
</script>
