import store from '@/store'
import { isNotEmpty } from '@/utils/validate'

export function buildFormItems(options, valueField, titleTield, tag, name, config) {
  const items = []
  if (isNotEmpty(options)) {
    let props = {}
    if (isNotEmpty(config)) {
      props = { ...config.props }
    }
    options.forEach(option => {
      const value = option[valueField]
      const title = option[titleTield]
      const item = {}
      if (isNotEmpty(tag)) {
        item.tag = tag
      }
      if (isNotEmpty(name)) {
        item.name = name
      }
      Object.assign(item, config)
      if (tag === 'el-radio') {
        item.text = title
        item.props = Object.assign({ label: value }, props)
      } else if (tag === 'el-option') {
        item.props = Object.assign({ label: title, value: value }, props)
      }
      items.push(item)
    })
  }
  return items
}

export function buildFormItemsByDicts(dictType, tag, name, config) {
  const dicts = store.getters.getDicts(dictType)
  return buildFormItems(dicts, 'value', 'title', tag, name, config)
}

export function fillFormItemDefaultProps(entity) {
  const { tag, items } = entity
  if (isNotEmpty(items)) {
    items.forEach(item => {
      fillFormItemDefaultProps(item)
    })
  }
  let { props } = entity
  if (!props) {
    props = {}
  }
  let defaultProps = { placeholder: '请输入 ...' }
  if (tag === 'el-input') {
    if (props.type === 'textarea') {
      defaultProps = Object.assign(defaultProps, { rows: 5 })
    }
  } else if (tag === 'el-input-number') {
    defaultProps = Object.assign(defaultProps, { controls: false, 'controls-position': 'right' })
  } else if (tag === 'el-radio') {
    defaultProps = Object.assign(defaultProps, { border: true })
  } else if (tag === 'el-select') {
    defaultProps = Object.assign(defaultProps, { placeholder: '请选择 ...' })
  } else if (tag === 'el-cascader') {
    defaultProps = Object.assign(defaultProps, { placeholder: '请选择 ...', 'expand-trigger': 'hover' })
  } else if (tag === 'el-date-picker') {
    let valueFormat = 'yyyy-MM-dd'
    if (props.type === 'datetime') {
      valueFormat = 'yyyy-MM-dd HH:mm:ss'
    } else if (props.type === 'year') {
      valueFormat = 'yyyy'
    } else if (props.type === 'month') {
      valueFormat = 'yyyy-MM'
    }
    defaultProps = Object.assign(defaultProps, { placeholder: '请选择 ...', 'value-format': valueFormat })
  }
  entity.props = Object.assign({}, defaultProps, props)
}

export function fillFormItemsDefaultProps(formItems) {
  formItems.forEach(item => {
    const items = item.items
    if (isNotEmpty(items)) {
      items.forEach(entity => {
        fillFormItemDefaultProps(entity)
      })
    }
  })
}
