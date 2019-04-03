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
import moment from 'moment'
import { isNotEmpty, validateIDNumber } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { childEducateSingle, childEducateSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'ChildEducateEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '子女教育',
      defaultModel: {
        ADCE_NATIONALITY: '001',
        ADCE_ID_TYPE: '01',
        ADCE_EDUCATE_STAGE: '1',
        ADCE_SCHOOL_SITE: '001',
        ADCE_RATIO: 100
      },
      getEntity: childEducateSingle,
      saveEntity: childEducateSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { ADCE_ID: PK }
        this.dialogTitle = '修改子女教育'
      } else {
        this.dialogTitle = '创建子女教育'
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
      items.push({ tag: 'el-new-row', title: '自然人信息' })
      items.push({
        props: {
          label: '子女姓名',
          prop: 'ADCE_NAME',
          rules: [
            { required: true, message: '请输入子女姓名', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADCE_NAME' }
        ]
      })
      items.push({
        props: {
          label: '出生日期',
          prop: 'ADCE_BIRTHDATE',
          rules: [
            { required: true, message: '请选择出生日期', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'ADCE_BIRTHDATE' }
        ]
      })
      items.push({
        props: { label: '国籍（地区）', prop: 'ADCE_NATIONALITY' },
        items: [
          {
            tag: 'el-select',
            name: 'ADCE_NATIONALITY',
            items: buildFormItemsByDicts('NATIONALITY', 'el-option')
          }
        ]
      })
      items.push({
        props: { label: '身份证件类型', prop: 'ADCE_ID_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADCE_ID_TYPE',
            items: buildFormItemsByDicts('ID_TYPE', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '身份证件号码',
          prop: 'ADCE_ID_NUMBER',
          rules: [
            { required: true, message: '请输入身份证件号码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (model.ADCE_ID_TYPE === '01') {
                  if (validateIDNumber(value)) {
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
          { tag: 'el-input', name: 'ADCE_ID_NUMBER' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '教育' })
      items.push({
        props: {
          label: '起始时间',
          prop: 'ADCE_STAGE_START',
          rules: [
            { required: true, message: '请选择起始时间', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'ADCE_STAGE_START' }
        ]
      })
      items.push({
        props: {
          label: '结束时间',
          prop: 'ADCE_STAGE_END',
          rules: [
            { required: true, message: '请选择结束时间', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const ADCE_STAGE_START = _model.ADCE_STAGE_START
                const ADCE_STAGE_END = _model.ADCE_STAGE_END
                if (isNotEmpty(ADCE_STAGE_START) && isNotEmpty(ADCE_STAGE_END)) {
                  const startDate = moment(ADCE_STAGE_START)
                  const endDate = moment(ADCE_STAGE_END)
                  if (startDate.isBefore(endDate)) {
                    callback()
                  } else {
                    callback(new Error('结束时间不能小于或等于起始时间'))
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
          { tag: 'el-date-picker', name: 'ADCE_STAGE_END' }
        ]
      })
      items.push({
        props: {
          label: '教育终止时间',
          prop: 'ADCE_EDUCATE_STOP',
          rules: [
            { required: true, message: '请选择教育终止时间', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const ADCE_STAGE_START = _model.ADCE_STAGE_START
                const ADCE_EDUCATE_STOP = _model.ADCE_EDUCATE_STOP
                if (isNotEmpty(ADCE_STAGE_START) && isNotEmpty(ADCE_EDUCATE_STOP)) {
                  const startDate = moment(ADCE_STAGE_START)
                  const educateDate = moment(ADCE_EDUCATE_STOP)
                  if (startDate.isBefore(educateDate)) {
                    callback()
                  } else {
                    callback(new Error('教育终止时间不能小于或等于起始时间'))
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
          { tag: 'el-date-picker', name: 'ADCE_EDUCATE_STOP' }
        ]
      })
      items.push({
        props: { label: '就读国家（地区）', prop: 'ADCE_SCHOOL_SITE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADCE_SCHOOL_SITE',
            items: buildFormItemsByDicts('NATIONALITY', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '就读学校',
          prop: 'ADCE_SCHOOL_NAME',
          rules: [
            { required: true, message: '请输入就读学校', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADCE_SCHOOL_NAME' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '扣除' })
      items.push({
        props: { label: '扣除比例', prop: 'ADCE_RATIO' },
        items: [
          {
            tag: 'el-switch',
            name: 'ADCE_RATIO',
            props: { 'active-text': '50%', 'active-value': 50, 'inactive-text': '100%', 'inactive-value': 100 }
          }
        ]
      })
      return items
    }
  }
}
</script>
