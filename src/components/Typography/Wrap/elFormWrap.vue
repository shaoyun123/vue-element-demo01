<template>
  <el-form v-loading="loading" ref="ref" v-bind="props" :model="model" v-on="events">
    <component v-for="(group, i) in groups" :key="'group_' + i" :is="group.showFeature ? 'el-card' : 'div'" v-bind="buildGroupProps(group)">
      <div v-if="group.showFeature" slot="header" class="group-title">
        <i class="el-icon-antd-appstore" />
        {{ group.title }}
        <div v-if="group.actions && group.actions.length" class="group-action">
          <el-button-wrap v-for="(action, ai) in group.actions" :key="'ga_' + ai" :c-o-m="buildActionCOM(action)" />
        </div>
      </div>
      <el-row v-for="(row, j) in group.rows" :key="'row_' + j" :gutter="18">
        <div v-if="row.showFeature" v-bind="buildRowTitleProps(group, row)">
          <i class="el-icon-antd-detail" />
          {{ row.title }}
          <span v-if="row.actions && row.actions.length" class="row-action">
            &lt;
            <el-button-wrap v-for="(action, ai) in row.actions" :key="'ra_' + ai" :c-o-m="buildActionCOM(action)" />
            &gt;
          </span>
        </div>
        <el-col v-for="(item, k) in row.items" :key="item.props.prop" v-bind="buildColProps(row, j, item, k)">
          <el-form-item v-bind="item.props" v-on="item.events">
            <template v-if="item.tip && item.tip.length" slot="label">
              {{ item.props.label }}
              <el-tooltip>
                <div slot="content"><span v-html="item.tip" /></div>
                <el-button type="text" icon="el-icon-antd-question-circle" />
              </el-tooltip>
            </template>
            <component
              v-if="item.component"
              :ref="'ref-' + item.component.name"
              :is="item.component.component"
              v-bind="item.component.props"
              v-on="item.component.events" />
            <el-form-item-wrap
              v-for="(entity, l) in item.items"
              :key="getKey(entity, l)"
              :value="getModelValue(entity.name)"
              :c-o-m="entity"
              v-bind="entity.props"
              @[inputEvent(entity)]="handleInput($event, entity)"
              v-on="entity.events" />
          </el-form-item>
        </el-col>
      </el-row>
    </component>
  </el-form>
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { fillFormItemsDefaultProps } from '@/components/Typography/kit'
import ElFormItemWrap from '@/components/Typography/Wrap/ElFormItemWrap'
import ElButtonWrap from '@/components/Typography/Wrap/ElButtonWrap'

export default {
  name: 'ElFormWrap',
  components: { ElFormItemWrap, ElButtonWrap },
  props: {
    COM: {
      type: Object,
      default: function() {
        /*
        item 基于 ComponentObjectModel 扩展
          span: 24，指定列占用栅格数，未指定则启用响应式配置
          tip: '提示内容'，为 label 添加提示信息
          linkage: [true | false] 是否为联动组件，为了减少重复渲染，不会实时的将 model 变化 @input 父组件，但是某些组件的值变更会导致 items 变化，这些组件便称为联动组件
          component { 增加对自定义组件的引入
            name: '', // 组件名称，可以根据名称获取组件 ref [page.scope.唯一]
            component: () => import(`@/.../name`), // 组件
            props: {}, // 绑定参数
            events: {} // 绑定事件
          }
        组 item：{
          tag: 'el-new-group'
          title: 标题
          actions: [{ tip, icon, click }]
          showFeature: 是否显示组的 DOM 特性，默认为 false，当 title 不为空则默认置为 true
        }
        遇组 item 则创建新 group
        行 item：{
          tag: 'el-new-row'
          title: 标题
          actions: []
          showFeature: 是否显示行的 DOM 特性，默认为 false，当 title 不为空则默认置为 true
        }
        遇行 item 则创建新 row

        数据结构：
          groups: [
            {
              title: '',
              rows: [
                {
                  title: '',
                  items: []
                }
              ]
            }
          ]
        */
        return {}
      }
    },
    resetTo: {
      type: Object,
      default: function() {
        return null
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      et: 'input',
      model: {},
      xs: 12,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4
    }
  },
  computed: {
    props: function() {
      const props = {
        'label-position': 'top',
        ...this.COM.props
      }
      this.setModel(props.model)
      return props
    },
    events: function() {
      return this.COM.events
    },
    groups: function() {
      const groups = []
      const items = this.COM.items
      if (isNotEmpty(items)) {
        fillFormItemsDefaultProps(items)
        items.forEach((item, i) => {
          const tag = item.tag
          const title = item.title
          const actions = item.actions
          let showFeature = item.showFeature || false
          if (isNotEmpty(title)) {
            showFeature = true
          }
          if (tag === 'el-new-group') {
            groups.push({ title, actions, showFeature, rows: [] })
            return
          }
          if (groups.length === 0) {
            groups.push({ rows: [] })
          }
          const group = groups[groups.length - 1]
          if (tag === 'el-new-row') {
            group.rows.push({ title, actions, showFeature, items: [] })
            return
          }
          const rows = group.rows
          if (rows.length === 0) {
            rows.push({ items: [] })
          }
          const row = rows[rows.length - 1]
          row.items.push(item)
        })
      }
      return groups
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
    getKey(item, index) {
      const tag = item.tag
      const name = item.name
      let key = tag
      if (isNotEmpty(name)) {
        key += ('-' + name)
      }
      key += index
      return key
    },
    buildActionCOM(action) {
      const { tip = '', icon, click = () => {} } = action
      return {
        tip,
        props: { icon, type: 'text' },
        events: { click }
      }
    },
    buildGroupProps: function(group) {
      const props = { shadow: 'never' }
      const showGroupFeature = group.showFeature
      const classes = []
      if (showGroupFeature) {
        classes.push('form-group')
      }
      props.class = classes
      return props
    },
    buildRowTitleProps: function(group, row) {
      const props = {}
      const showGroupFeature = group.showFeature
      const classes = ['row-title']
      if (!showGroupFeature) {
        classes.push('row-title-pl')
      }
      props.class = classes
      return props
    },
    buildColProps: function(row, rowIndex, col, colIndex) {
      const props = {}
      const span = col.span
      if (isNotEmpty(span)) {
        props.span = span
      } else {
        // 未指定 span 则启用响应式配置
        props.xs = this.xs
        props.sm = this.sm
        props.md = this.md
        props.lg = this.lg
        props.xl = this.xl
      }
      const classes = [] // 样式 form-item 在组件上部增加虚线
      const showFeature = row.showFeature
      if (!showFeature && rowIndex > 0) {
        classes.push('form-item')
      } else {
        // 计算每行最多可放置的组件数量
        let colCount = 0
        const diviceWidth = this.$store.getters.deviceSize.width
        if (diviceWidth >= 1920) {
          colCount = 24 / this.xl
        } else if (diviceWidth >= 1200) {
          colCount = 24 / this.lg
        } else if (diviceWidth >= 992) {
          colCount = 24 / this.md
        } else if (diviceWidth >= 768) {
          colCount = 24 / this.sm
        } else if (diviceWidth < 768) {
          colCount = 24 / this.xs
        }
        // 当 colIndex 大于 colCount 时则说明到达第二行，需要添加样式 form-item
        if (colIndex >= colCount) {
          // colIndex 下标从 0 开始，因此使用 >=
          classes.push('form-item')
        }
      }
      props.class = classes
      return props
    },
    inputEvent(entity) {
      let event = 'input'
      const tag = entity.tag
      if (tag === 'el-input-number') {
        event = 'input'
      }
      return event
    },
    handleInput(value, entity) {
      const { name, linkage } = entity
      const model = { ...this.model }
      this.setModelValue(value, name, model)
      this.setModel(model)
      if (linkage) {
        this.$emit('input', this.model)
      }
    },
    getModelValue(name) {
      let value = ''
      if (isNotEmpty(name)) {
        value = this.model
        name.split('.').forEach(fragment => {
          value = value[fragment]
        })
      }
      return value
    },
    setModelValue(value, name, model) {
      if (isNotEmpty(name)) {
        const fragments = name.split('.')
        const fragmentLen = fragments.length
        if (fragmentLen === 1) {
          model[name] = value
        } else {
          let valueRef = model
          fragments.forEach((fragment, i) => {
            if (i === fragmentLen - 1) {
              valueRef[fragment] = value
            } else {
              valueRef = valueRef[fragment]
            }
          })
        }
      }
    },
    setModel(model) {
      if (isNotEmpty(model, true)) {
        this.model = model
      }
    },
    getModel() {
      return { ...this.model }
    },
    clearValidate() {
      const ref = this.ref()
      if (isNotEmpty(ref)) {
        ref.clearValidate()
      }
    },
    validateForm() {
      this.clearValidate()
      const ref = this.ref()
      if (isNotEmpty(ref)) {
        return ref.validate()
      } else {
        return false
      }
    },
    clearForm() {
      const ref = this.ref()
      if (isNotEmpty(ref)) {
        ref.resetFields()
      }
    },
    resetForm() {
      if (isNotEmpty(this.resetTo)) {
        this.$emit('input', this.resetTo)
      } else {
        this.clearForm()
      }
    },
    ref() {
      return this.$refs.ref
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-group {
  margin-bottom: 18px;
}

.group-title {
  font-weight: bold;
}

.group-action {
  float: right;
  margin-top: -1px;
  .el-button--text {
    padding: 0px;
  }
}

.row-title {
  font-weight: bold;
  padding-bottom: 18px;
}

.row-title-pl {
  padding-left: 8px;
}

.row-action {
  .el-button--text {
    padding: 0px;
  }
}

.form-item {
  border-top: 1px dashed rgb(235, 238, 245);
}
</style>
