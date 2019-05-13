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
import { isNotEmpty, validateIDNumber } from '@/utils/validate'
import { buildFormItemsByDicts } from '@/components/Typography/kit'
import { supportAgedSingle, supportAgedSave } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'SupportAgedEdit',
  components: { BasicEdit },
  data() {
    return {
      formTitle: '赡养老人',
      defaultModel: {
        ADSA_TAXPAYER_TYPE: '1',
        ADSA_RELATION: '1',
        ADSA_ID_TYPE: '01',
        ADSA_NATIONALITY: '001'
      },
      getEntity: supportAgedSingle,
      saveEntity: supportAgedSave
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (isNotEmpty(PK)) {
        primaryKey = { ADSA_ID: PK }
        this.formTitle = '修改赡养老人'
      } else {
        this.formTitle = '创建赡养老人'
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
      if (model.ADSA_TAXPAYER_TYPE === '1') {
        model.ADSA_APPORTION_TYPE = ''
        model.ADSA_PARTNER_NAME = ''
        model.ADSA_PARTNER_NATIONALITY = ''
        model.ADSA_PARTNER_ID_TYPE = ''
        model.ADSA_PARTNER_ID_NUMBER = ''
      }
      return model
    },
    handleItems(operate, model) {
      const items = []
      items.push({ tag: 'el-new-row', title: '被赡养人' })
      items.push({
        props: { label: '被赡养人关系', prop: 'ADSA_RELATION' },
        items: buildFormItemsByDicts('AD_S5T_A2D_ADSA_RELATION', 'el-radio', 'ADSA_RELATION')
      })
      items.push({
        props: {
          label: '被赡养人姓名',
          prop: 'ADSA_NAME',
          rules: [
            { required: true, message: '请输入被赡养人姓名', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'ADSA_NAME' }
        ]
      })
      items.push({
        props: {
          label: '被赡养人出生日期',
          prop: 'ADSA_BIRTHDATE',
          rules: [
            { required: true, message: '请选择被赡养人出生日期', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'ADSA_BIRTHDATE' }
        ]
      })
      items.push({
        props: { label: '被赡养人国籍（地区）', prop: 'ADSA_NATIONALITY' },
        items: [
          {
            tag: 'el-select',
            name: 'ADSA_NATIONALITY',
            items: buildFormItemsByDicts('NATIONALITY', 'el-option')
          }
        ]
      })
      items.push({
        props: { label: '被赡养人身份证件类型', prop: 'ADSA_ID_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'ADSA_ID_TYPE',
            items: buildFormItemsByDicts('ID_TYPE', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '被赡养人身份证件号码',
          prop: 'ADSA_ID_NUMBER',
          rules: [
            { required: true, message: '请输入被赡养人身份证件号码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (model.ADSA_ID_TYPE === '01') {
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
          { tag: 'el-input', name: 'ADSA_ID_NUMBER' }
        ]
      })
      items.push({ tag: 'el-new-row', title: '共同赡养' })
      items.push({
        props: { label: '纳税人身份', prop: 'ADSA_TAXPAYER_TYPE' },
        items: buildFormItemsByDicts('AD_S5T_A2D_ADSA_TAXPAYER_TYPE', 'el-radio', 'ADSA_TAXPAYER_TYPE', { linkage: true })
      })
      if (model.ADSA_TAXPAYER_TYPE === '2') {
        items.push({
          props: {
            label: '分摊方式',
            prop: 'ADSA_APPORTION_TYPE',
            rules: [
              { required: true, message: '请选择分摊方式', trigger: 'blur' }
            ]
          },
          items: [
            {
              tag: 'el-select',
              name: 'ADSA_APPORTION_TYPE',
              items: buildFormItemsByDicts('AD_S5T_A2D_ADSA_APPORTION_TYPE', 'el-option')
            }
          ]
        })
        items.push({
          props: {
            label: '共同赡养人姓名',
            prop: 'ADSA_PARTNER_NAME',
            rules: [
              { required: true, message: '请输入共同赡养人姓名', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input', name: 'ADSA_PARTNER_NAME' }
          ]
        })
        items.push({
          props: {
            label: '共同赡养人国籍（地区）',
            prop: 'ADSA_PARTNER_NATIONALITY',
            rules: [
              { required: true, message: '请选择共同赡养人国籍（地区）', trigger: 'blur' }
            ]
          },
          items: [
            {
              tag: 'el-select',
              name: 'ADSA_PARTNER_NATIONALITY',
              items: buildFormItemsByDicts('NATIONALITY', 'el-option')
            }
          ]
        })
        items.push({
          props: {
            label: '共同赡养人身份证件类型',
            prop: 'ADSA_PARTNER_ID_TYPE',
            rules: [
              { required: true, message: '请选择共同赡养人身份证件类型', trigger: 'blur' }
            ]
          },
          items: [
            {
              tag: 'el-select',
              name: 'ADSA_PARTNER_ID_TYPE',
              items: buildFormItemsByDicts('ID_TYPE', 'el-option')
            }
          ]
        })
        items.push({
          props: {
            label: '共同赡养人身份证件号码',
            prop: 'ADSA_PARTNER_ID_NUMBER',
            rules: [
              { required: true, message: '请输入共同赡养人身份证件号码', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  if (model.ADSA_PARTNER_ID_TYPE === '01') {
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
            { tag: 'el-input', name: 'ADSA_PARTNER_ID_NUMBER' }
          ]
        })
      }
      return items
    }
  }
}
</script>
