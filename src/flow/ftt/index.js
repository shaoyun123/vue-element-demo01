import moment from 'moment'
import { isNotEmpty } from '@/utils/validate'
import { showConfirm } from '@/utils/element'
import { buildTableActions, buildFormItemsByDicts } from '@/components/Typography/kit'
import {
  taxTypeList,
  taxTypeDelete,
  taxTypeSingle,
  taxTypeSave,
  taxTypeCaliberList,
  taxTypeCaliberSingle,
  taxTypeCaliberSave
} from '@/api/ftt'

const SM_TTL2t = () => {
  return {
    components: function(vm, scopeMeta) {
      const components = []
      components.push({
        name: 'TaxTypeEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
        props: { scope: 'TaxTypeEdit' }
      })
      components.push({
        name: 'TaxTypeCaliberEdit', component: () => import(`@/components/Typography/Flow/EditBasic`),
        props: { scope: 'TaxTypeCaliberEdit' }
      })
      return components
    },
    categoryController: function(vm, scopeMeta) {
      return {
        items: [
          {
            text: '新增', props: { icon: 'el-icon-antd-plus' }, events: { click: () => vm.ref('TaxTypeEdit').showDialog({}) }
          },
          {
            selectedRowVisible: true, text: '删除', props: { icon: 'el-icon-antd-delete', type: 'danger' },
            events: {
              click: function() {
                const checkedNodes = vm.ref().refCategory().checkedNodes
                if (isNotEmpty(checkedNodes)) {
                  showConfirm({ content: '是否删除数据 ？', type: 'warning' }).then(() => {
                    const pks = checkedNodes.map(checkedNode => {
                      return checkedNode.TT_ID
                    })
                    taxTypeDelete(pks).then(response => {
                      vm.ref().refresh()
                    })
                  }).catch(() => {})
                }
              }
            }
          }
        ]
      }
    },
    categoryTree: function(vm, scopeMeta) {
      return {
        props: {
          'node-key': 'TT_ID',
          props: {
            label: function(data, node) {
              return data.TT_NAME + ` [${data.TT_ID}]`
            },
            isLeaf: function(data, node) {
              return true
            }
          },
          lazy: true,
          load: (node, resolve) => {
            taxTypeList({}).then(response => {
              resolve(response.data.items)
            })
          }
        },
        menu: {
          command: (command, data) => {
            if (command === 'edit') {
              vm.ref('TaxTypeEdit').showDialog({ TT_ID: data.TT_ID })
            }
          },
          items: [
            {
              text: '编辑', props: { command: 'edit', icon: 'el-icon-antd-edit' }
            }
          ]
        }
      }
    },
    linkageMethod: function(vm, scopeMeta) {
      return (data, node) => {
        return { TTC_TAX_TYPE_ID: data.TT_ID }
      }
    },
    controller: function(vm, scopeMeta) {
      return {
        items: [
          {
            text: '新增', props: { icon: 'el-icon-antd-plus' }, events: { click: () => vm.ref('TaxTypeCaliberEdit').showDialog({}) }
          }
        ]
      }
    },
    searcher: function(vm, scopeMeta) {
      const { getDistricts } = vm.$store.getters
      return {
        extraParams: { TTC_TAX_TYPE_ID: '_empty_' },
        items: [
          {
            props: { label: '地区', prop: 'TTC_DISTRICT' },
            items: [
              {
                tag: 'el-cascader',
                name: 'TTC_DISTRICT',
                props: { options: getDistricts }
              }
            ]
          }
        ]
      }
    },
    table: function(vm, scopeMeta) {
      const { getDistrictTitle } = vm.$store.getters
      return {
        items: [
          {
            props: {
              label: '地区', prop: 'TTC_DISTRICT', fixed: 'left', width: '150',
              formatter: function(row, column, cellValue, index) {
                return getDistrictTitle(cellValue[cellValue.length - 1])
              }
            }
          },
          {
            props: { label: '生效日期', prop: 'TTC_DATE_START', fixed: 'left', align: 'center', width: '100' }
          },
          {
            props: { label: '失效日期', prop: 'TTC_DATE_END', fixed: 'left', align: 'center', width: '100' }
          },
          {
            props: { prop: 'fill' }
          },
          {
            props: {
              label: '操作', prop: 'action', fixed: 'right', align: 'center', width: '100',
              formatter: function(row, column, cellValue, index) {
                const pk = { TTC_ID: row.TTC_ID }
                return buildTableActions(vm, [
                  { title: '编辑', click: () => vm.ref('TaxTypeCaliberEdit').showDialog(pk) }
                ])
              }
            }
          }
        ]
      }
    },
    paginationMethod: function(vm, scopeMeta) {
      return taxTypeCaliberList
    }
  }
}
const SM_TTE2t = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '税种信息'
    },
    defaultModel: function(vm, scopeMeta) {
      return {
        TT_STATUS: 'E'
      }
    },
    handleItems: function(vm, scopeMeta) {
      return (operate, model) => {
        const items = []
        const editing = (operate === 'edit')
        items.push({
          props: {
            label: '税种号', prop: 'TT_ID',
            rules: [
              { required: true, message: '请输入税种号', trigger: 'blur' }
            ]
          },
          items: [
            {
              tag: 'el-input', name: 'TT_ID', props: { disabled: editing }
            }
          ]
        })
        items.push({
          props: {
            label: '税种名', prop: 'TT_NAME',
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
              tag: 'el-input', name: 'TT_DESCR', props: { type: 'textarea' }
            }
          ]
        })
        items.push({
          props: { label: '状态', prop: 'TT_STATUS' },
          items: buildFormItemsByDicts('ED', 'el-radio', 'TT_STATUS')
        })
        return items
      }
    },
    getMethod: function(vm, scopeMeta) {
      return taxTypeSingle
    },
    saveMethod: function(vm, scopeMeta) {
      return taxTypeSave
    }
  }
}
const SM_TTCE2t = () => {
  return {
    formTitle: function(vm, scopeMeta) {
      return '口径'
    },
    defaultModel: function(vm, scopeMeta) {
      return {
        TTC_DISTRICT: ['001', '001001'],
        TTC_BASISES: [],
        TTC_RATIO_CALCS: []
      }
    },
    controller: function(vm, scopeMeta) {
      const addItem = (field, value) => {
        const model = vm.getModel()
        model[field].push(value)
        vm.handleDialogInput(model)
      }
      const items = []
      items.push({
        tip: '添加计税依据项', props: { icon: 'el-icon-antd-filesearch' },
        events: {
          click: () => addItem('TTC_BASISES', { KEY: '', TITLE: '', TABLE: '', FIELD: '' })
        }
      })
      items.push({
        tip: '添加税率认定项', props: { icon: 'el-icon-antd-percentage' },
        events: {
          click: () => addItem('TTC_RATIO_CALCS', { VALUE: '', TITLE: '', SCRIPT: '' })
        }
      })
      return { items }
    },
    handleItems: function(vm, scopeMeta) {
      const delItem = (field, index) => {
        showConfirm({ content: '是否删除此组数据 ？', type: 'warning' }).then(() => {
          const model = vm.getModel()
          model[field].splice(index, 1)
          vm.handleDialogInput(model)
        }).catch(() => {})
      }
      return (operate, model) => {
        const { getDistricts } = vm.$store.getters
        const items = []
        items.push({
          props: { label: '地区', prop: 'TTC_DISTRICT' },
          items: [
            {
              tag: 'el-cascader', name: 'TTC_DISTRICT', props: { options: getDistricts }
            }
          ]
        })
        items.push({
          props: {
            label: '生效日期', prop: 'TTC_DATE_START',
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
            label: '失效日期', prop: 'TTC_DATE_END',
            rules: [
              { required: true, message: '请选择失效日期', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  const _model = vm.ref().getModel()
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
              tag: 'el-new-row', title: `第 ${i + 1} 组`, actions: [{ tip: '删除', icon: 'el-icon-antd-delete', click: () => delItem('TTC_BASISES', i) }]
            })
            items.push({
              props: {
                label: '键', prop: prefix + 'KEY',
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
                label: '标题', prop: prefix + 'TITLE',
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
                label: '物理表名', prop: prefix + 'TABLE',
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
                label: '物理表字段', prop: prefix + 'FIELD',
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
              tag: 'el-new-row', title: `第 ${i + 1} 组`, actions: [{ tip: '删除', icon: 'el-icon-antd-delete', click: () => delItem('TTC_RATIO_CALCS', i) }]
            })
            items.push({
              props: {
                label: '税率', prop: prefix + 'VALUE',
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
                label: '标题', prop: prefix + 'TITLE',
                rules: [
                  { required: true, message: '请输入标题', trigger: 'blur' }
                ]
              },
              items: [
                { tag: 'el-input', name: prefix + 'TITLE' }
              ]
            })
            items.push({
              span: 24,
              props: {
                label: '认定公式', prop: prefix + 'SCRIPT',
                rules: [
                  { required: true, message: '请输入认定公式', trigger: 'blur' }
                ]
              },
              items: [
                {
                  tag: 'el-input', name: prefix + 'SCRIPT', props: { type: 'textarea' }
                }
              ]
            })
          })
        }
        return items
      }
    },
    getMethod: function(vm, scopeMeta) {
      return taxTypeCaliberSingle
    },
    saveMethod: function(vm, scopeMeta) {
      return taxTypeCaliberSave
    }
  }
}

export default [
  {
    id: 'flow_ftt_text',
    title: '全税种测试流程',
    descr: '全税种测试流程',
    pages: [
      {
        routerName: 'FTT-TaxType',
        title: '税种管理',
        descr: '税种管理',
        meta: {
          'FTT-TaxType': SM_TTL2t(),
          'TaxTypeEdit': SM_TTE2t(),
          'TaxTypeCaliberEdit': SM_TTCE2t()
        }
      }
    ]
  }
]
