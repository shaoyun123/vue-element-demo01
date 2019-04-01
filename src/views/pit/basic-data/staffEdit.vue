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
import * as validator from '@/utils/validate'
import { buildFormItems, buildFormItemsByDicts } from '@/components/Typography/kit'
import { staffSingle, staffSave, enterpriseList } from '@/api/pit'
import BasicEdit from '@/views/components/basicEdit'

export default {
  name: 'StaffEdit',
  components: { BasicEdit },
  data() {
    return {
      dialogTitle: '员工信息',
      defaultModel: {
        S_GENDER: 'M',
        S_NATIONALITY: '001',
        S_ID_TYPE: '01',
        S_EDUCATION: '01',
        S_STATUS: '1',
        S_IS_STAFF: 'Y',
        S_DUTY: '2',
        S_IS_MARITAL: 'N',
        S_IS_DISABLED: 'N',
        S_IS_HERO_FM: 'N',
        S_IS_LONELY_ELDERLY: 'N',
        S_IS_INVESTOR: 'N',
        S_IS_OVERSEA: 'N',
        S_VERIFY_STATUS: '1',
        S_RECORD_STATUS: '1'
      },
      getEntity: staffSingle,
      saveEntity: staffSave,
      enterpriseOptions: []
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (validator.isNotEmpty(PK)) {
        primaryKey = { S_NUMBER: PK }
        this.dialogTitle = '修改员工信息'
      } else {
        this.dialogTitle = '创建员工信息'
      }
      enterpriseList({}).then(response => {
        this.enterpriseOptions = response.data.items
        this.$refs['ref'].showDialog(primaryKey)
      })
    },
    beforeSave(operate, model) {
      this.$emit('before-save', model)
    },
    afterSave(operate, model) {
      this.$emit('after-save', model)
    },
    handleModel(operate, model) {
      if (model.S_IS_MARITAL === 'N') {
        model.S_SPOUSE_NAME = ''
        model.S_SPOUSE_ID_TYPE = ''
        model.S_SPOUSE_ID_NUMBER = ''
      }
      if (model.S_IS_DISABLED === 'N') {
        model.S_DC_NUMBER = ''
      }
      if (model.S_IS_HERO_FM === 'N') {
        model.S_HFMC_NUMBER = ''
      }
      if (model.S_IS_INVESTOR === 'N') {
        model.S_CORPORATE_ASSETS = ''
        model.S_PERSONAL_ASSETS = ''
        model.S_ASSETS_RATIO = ''
      }
      if (model.S_IS_OVERSEA === 'N') {
        model.S_CHEGADA_TIME = ''
        model.S_PARTIDA_TIME = ''
        model.S_PARTIDA_ADDRESS = ''
        model.S_TENURE = ''
        model.S_HAVE_INLAND_DOMICILE = ''
        model.S_INLAND_DUTY = ''
        model.S_OVERSEA_DUTY = ''
        model.S_INLAND_YIELDLY = ''
        model.S_OVERSEA_YIELDLY = ''
      }
      return model
    },
    handleItems(operate, model) {
      const items = []
      const editing = (operate === 'edit')
      items.push({
        props: {
          label: '员工号',
          prop: 'S_NUMBER',
          rules: [
            { required: true, message: '请输入员工号', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-input',
            name: 'S_NUMBER',
            props: { disabled: editing }
          }
        ]
      })
      items.push({
        props: {
          label: '所属企业',
          prop: 'S_ENTERPRISE_ID',
          rules: [
            { required: true, message: '请输入所属企业', trigger: 'blur' }
          ]
        },
        items: [
          {
            tag: 'el-select',
            name: 'S_ENTERPRISE_ID',
            items: buildFormItems(this.enterpriseOptions, 'E_ID', 'E_NAME', 'el-option')
          }
        ]
      })
      items.push({ tag: 'el-new-group', title: '基础信息' })
      items.push({ tag: 'el-new-row', title: '自然人信息' })
      items.push({
        props: {
          label: '姓名',
          prop: 'S_NAME',
          rules: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'S_NAME' }
        ]
      })
      items.push({
        props: { label: '性别', prop: 'S_GENDER' },
        items: buildFormItemsByDicts('GENDER', 'el-radio', 'S_GENDER')
      })
      items.push({
        props: {
          label: '出生日期',
          prop: 'S_BIRTHDATE',
          rules: [
            { required: true, message: '请选择出生日期', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-date-picker', name: 'S_BIRTHDATE' }
        ]
      })
      items.push({
        props: { label: '国籍（地区）', prop: 'S_NATIONALITY' },
        items: [
          {
            tag: 'el-select',
            name: 'S_NATIONALITY',
            items: buildFormItemsByDicts('NATIONALITY', 'el-option')
          }
        ]
      })
      items.push({
        props: { label: '身份证件类型', prop: 'S_ID_TYPE' },
        items: [
          {
            tag: 'el-select',
            name: 'S_ID_TYPE',
            items: buildFormItemsByDicts('ID_TYPE', 'el-option')
          }
        ]
      })
      items.push({
        props: {
          label: '身份证件号码',
          prop: 'S_ID_NUMBER',
          rules: [
            { required: true, message: '请输入身份证件号码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (model.S_ID_TYPE === '01') {
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
          { tag: 'el-input', name: 'S_ID_NUMBER' }
        ]
      })
      items.push({
        props: { label: '联系地址', prop: 'S_ADDRESS' },
        items: [
          { tag: 'el-input', name: 'S_ADDRESS' }
        ]
      })
      items.push({
        props: {
          label: '手机号码',
          prop: 'S_PHONE',
          rules: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'S_PHONE' }
        ]
      })
      items.push({
        props: {
          label: '电子邮箱',
          prop: 'S_EMAIL',
          rules: [
            { type: 'email', message: '请输入正确的电子邮箱', trigger: 'blur' }
          ]
        },
        items: [
          { tag: 'el-input', name: 'S_EMAIL' }
        ]
      })
      items.push({
        props: { label: '学历', prop: 'S_EDUCATION' },
        items: [
          {
            tag: 'el-select',
            name: 'S_EDUCATION',
            items: buildFormItemsByDicts('EDUCATION', 'el-option')
          }
        ]
      })
      items.push({ tag: 'el-new-row', title: '任职信息' })
      items.push({
        props: { label: '人员状态', prop: 'S_STATUS' },
        items: buildFormItemsByDicts('S3F_S_STATUS', 'el-radio', 'S_STATUS')
      })
      items.push({
        props: { label: '是否雇员', prop: 'S_IS_STAFF' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_STAFF')
      })
      items.push({
        props: { label: '受雇日期', prop: 'S_HIRE_DATE' },
        items: [
          { tag: 'el-date-picker', name: 'S_HIRE_DATE' }
        ]
      })
      items.push({
        props: {
          label: '离职日期',
          prop: 'S_TERM_DATE',
          rules: [
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const S_HIRE_DATE = _model.S_HIRE_DATE
                const S_TERM_DATE = _model.S_TERM_DATE
                if (validator.isNotEmpty(S_HIRE_DATE) && validator.isNotEmpty(S_TERM_DATE)) {
                  const hierDate = moment(S_HIRE_DATE)
                  const termDate = moment(S_TERM_DATE)
                  if (hierDate.isBefore(termDate)) {
                    callback()
                  } else {
                    callback(new Error('离职日期不能小于或等于受雇日期'))
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
          { tag: 'el-date-picker', name: 'S_TERM_DATE' }
        ]
      })
      items.push({
        props: { label: '部门', prop: 'S_DEPARTMENT' },
        items: [
          { tag: 'el-input', name: 'S_DEPARTMENT' }
        ]
      })
      items.push({
        props: { label: '职务', prop: 'S_DUTY' },
        items: buildFormItemsByDicts('S3F_S_DUTY', 'el-radio', 'S_DUTY')
      })
      items.push({
        props: { label: '开户银行', prop: 'S_DEPOSIT_BANK' },
        items: [
          { tag: 'el-input', name: 'S_DEPOSIT_BANK' }
        ]
      })
      items.push({
        props: {
          label: '银行账号',
          prop: 'S_BANK_NUMBER',
          rules: [
            {
              validator: (rule, value, callback) => {
                const _model = this.$refs['ref'].getModel()
                const S_DEPOSIT_BANK = _model.S_DEPOSIT_BANK
                if (validator.isNotEmpty(S_DEPOSIT_BANK) && !validator.validateBankCard(value)) {
                  callback(new Error('请输入正确的银行账号'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        items: [
          { tag: 'el-input', name: 'S_BANK_NUMBER' }
        ]
      })
      items.push({ tag: 'el-new-group', title: '扩展信息' })
      items.push({ tag: 'el-new-row', title: '配偶' })
      items.push({
        props: { label: '是否已婚', prop: 'S_IS_MARITAL' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_MARITAL', { linkage: true })
      })
      if (model.S_IS_MARITAL === 'Y') {
        items.push({
          props: {
            label: '配偶姓名',
            prop: 'S_SPOUSE_NAME',
            rules: [
              { required: true, message: '请输入配偶姓名', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input', name: 'S_SPOUSE_NAME' }
          ]
        })
        items.push({
          props: {
            label: '配偶身份证件类型',
            prop: 'S_SPOUSE_ID_TYPE',
            rules: [
              { required: true, message: '请选择配偶身份证件类型', trigger: 'blur' }
            ]
          },
          items: [
            {
              tag: 'el-select',
              name: 'S_SPOUSE_ID_TYPE',
              items: buildFormItemsByDicts('ID_TYPE', 'el-option')
            }
          ]
        })
        items.push({
          props: {
            label: '配偶身份证件号码',
            prop: 'S_SPOUSE_ID_NUMBER',
            rules: [
              { required: true, message: '请输入配偶身份证件号码', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  if (model.S_SPOUSE_ID_TYPE === '01') {
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
            { tag: 'el-input', name: 'S_SPOUSE_ID_NUMBER' }
          ]
        })
      }
      items.push({ tag: 'el-new-row', title: '其它证件' })
      items.push({
        props: { label: '是否残疾', prop: 'S_IS_DISABLED' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_DISABLED', { linkage: true })
      })
      if (model.S_IS_DISABLED === 'Y') {
        items.push({
          props: {
            label: '残疾证号',
            prop: 'S_DC_NUMBER',
            rules: [
              { required: true, message: '请输入残疾证号', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input', name: 'S_DC_NUMBER' }
          ]
        })
      }
      items.push({
        props: { label: '是否烈属', prop: 'S_IS_HERO_FM' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_HERO_FM', { linkage: true })
      })
      if (model.S_IS_HERO_FM === 'Y') {
        items.push({
          props: {
            label: '烈属证号',
            prop: 'S_HFMC_NUMBER',
            rules: [
              { required: true, message: '请输入烈属证号', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input', name: 'S_HFMC_NUMBER' }
          ]
        })
      }
      items.push({
        props: { label: '是否孤老', prop: 'S_IS_LONELY_ELDERLY' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_LONELY_ELDERLY')
      })
      items.push({ tag: 'el-new-row', title: '股东信息' })
      items.push({
        props: { label: '是否股东（投资者）', prop: 'S_IS_INVESTOR' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_INVESTOR', { linkage: true })
      })
      if (model.S_IS_INVESTOR === 'Y') {
        items.push({
          props: {
            label: '公司股本（投资）总额',
            prop: 'S_CORPORATE_ASSETS',
            rules: [
              { required: true, message: '请输入个人股本（投资）额', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input-number', name: 'S_CORPORATE_ASSETS' }
          ]
        })
        items.push({
          props: {
            label: '个人股本（投资）额',
            prop: 'S_PERSONAL_ASSETS',
            rules: [
              { required: true, message: '请输入个人股本（投资）额', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input-number', name: 'S_PERSONAL_ASSETS' }
          ]
        })
        items.push({
          props: {
            label: '个人占股（投资）比例',
            prop: 'S_ASSETS_RATIO',
            rules: [
              { required: true, message: '请输入个人占股（投资）比例', trigger: 'blur' }
            ]
          },
          items: [
            { tag: 'el-input-number', name: 'S_ASSETS_RATIO' }
          ]
        })
      }
      items.push({ tag: 'el-new-row', title: '境外人员' })
      items.push({
        props: { label: '是否境外人员', prop: 'S_IS_OVERSEA' },
        items: buildFormItemsByDicts('YN', 'el-radio', 'S_IS_OVERSEA', { linkage: true })
      })
      if (model.S_IS_OVERSEA === 'Y') {
        items.push({
          props: { label: '首次入境时间', prop: 'S_CHEGADA_TIME' },
          items: [
            {
              tag: 'el-date-picker',
              name: 'S_CHEGADA_TIME',
              props: { type: 'datetime' }
            }
          ]
        })
        items.push({
          props: { label: '预计离境时间', prop: 'S_PARTIDA_TIME' },
          items: [
            {
              tag: 'el-date-picker',
              name: 'S_PARTIDA_TIME',
              props: { type: 'datetime' }
            }
          ]
        })
        items.push({
          props: { label: '预计离境地点', prop: 'S_PARTIDA_ADDRESS' },
          items: [
            { tag: 'el-input', name: 'S_PARTIDA_ADDRESS' }
          ]
        })
        items.push({
          props: { label: '任职期限', prop: 'S_TENURE' },
          items: [
            { tag: 'el-input-number', name: 'S_TENURE' }
          ]
        })
        items.push({
          props: { label: '境内无住所个人', prop: 'S_HAVE_INLAND_DOMICILE' },
          items: buildFormItemsByDicts('YN', 'el-radio', 'S_HAVE_INLAND_DOMICILE')
        })
        items.push({
          props: { label: '境内职务', prop: 'S_INLAND_DUTY' },
          items: buildFormItemsByDicts('S3F_S_DUTY', 'el-radio', 'S_INLAND_DUTY')
        })
        items.push({
          props: { label: '境外职务', prop: 'S_OVERSEA_DUTY' },
          items: buildFormItemsByDicts('S3F_S_DUTY', 'el-radio', 'S_OVERSEA_DUTY')
        })
        items.push({
          props: { label: '境内支付地', prop: 'S_INLAND_YIELDLY' },
          items: [
            { tag: 'el-input', name: 'S_INLAND_YIELDLY' }
          ]
        })
        items.push({
          props: { label: '境外支付地', prop: 'S_OVERSEA_YIELDLY' },
          items: [
            { tag: 'el-input', name: 'S_OVERSEA_YIELDLY' }
          ]
        })
      }
      items.push({ tag: 'el-new-group' })
      items.push({
        props: { label: '验证状态', prop: 'S_VERIFY_STATUS' },
        items: [
          {
            tag: 'el-select',
            name: 'S_VERIFY_STATUS',
            items: buildFormItemsByDicts('S3F_S_VERIFY_STATUS', 'el-option')
          }
        ]
      })
      items.push({
        props: { label: '报备状态', prop: 'S_RECORD_STATUS' },
        items: [
          {
            tag: 'el-select',
            name: 'S_RECORD_STATUS',
            items: buildFormItemsByDicts('S3F_S_RECORD_STATUS', 'el-option')
          }
        ]
      })
      items.push({
        props: { label: '备注', prop: 'S_REMARK' },
        items: [
          {
            tag: 'el-input',
            name: 'S_REMARK',
            props: { type: 'textarea' }
          }
        ]
      })
      return items
    }
  }
}
</script>
