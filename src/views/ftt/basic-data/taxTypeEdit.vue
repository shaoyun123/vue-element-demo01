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
import { isNotEmpty } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { taxTypeSingle, taxTypeSave } from '@/api/ftt'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'TaxTypeEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '税种信息',
      defaultModel: {
        TT_STATUS: 'E'
      },
      getEntity: taxTypeSingle,
      saveEntity: taxTypeSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { TT_ID: PK }
        this.dialogTitle = '修改税种信息'
      } else {
        this.dialogTitle = '创建税种信息'
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
      const editing = (operate === 'edit')
      items.push({
        props: {
          label: '税种号',
          prop: 'TT_ID',
          rules: [
            { required: true, message: '请输入税种号', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input',
            name: 'TT_ID',
            props: { disabled: editing }
          }
        ]
      })
      items.push({
        props: {
          label: '税种名',
          prop: 'TT_NAME',
          rules: [
            { required: true, message: '请输入税种名', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'TT_NAME' }
        ]
      })
      items.push({
        props: { label: '描述', prop: 'TT_DESCR' },
        items: [
          {
            tag: 'el-input',
            name: 'TT_DESCR',
            props: { type: 'textarea' }
          }
        ]
      })
      items.push({
        props: { label: '状态', prop: 'TT_STATUS' },
        items: buildFormItemsByDicts('ED', 'el-radio', 'TT_STATUS')
      })
      return items
    }
  }
}
</script>
