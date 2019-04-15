<template>
  <el-form v-loading="loading" ref="ref" v-bind="props" :model="model" v-on="events">
    <component
      v-for="(group, i) in groups"
      :key="'group_' + i"
      :is="group.showFeature ? 'el-card' : 'div'"
      :class="addGroupClass(group.showFeature)"
      shadow="never">
      <div v-if="group.showFeature" slot="header" class="group-title">
        <i class="el-icon-antd-appstore" />
        {{ group.title }}
        <div v-if="group.actions && group.actions.length" class="group-action">
          <el-button-wrap v-for="(action, ai) in group.actions" :key="'cr' + ai" :c-o-m="getActionCOM(action)" />
        </div>
      </div>
      <el-row v-for="(row, j) in group.rows" :key="'row_' + j" :gutter="18">
        <div v-if="row.showFeature" :class="addRowTitleClass(group.showFeature)">
          <i class="el-icon-antd-detail" />
          {{ row.title }}
          <div v-if="row.actions && row.actions.length" class="row-action">
            <el-button-wrap v-for="(action, ai) in row.actions" :key="'cr' + ai" :c-o-m="getActionCOM(action)" />
          </div>
        </div>
        <el-col
          v-for="(item, k) in row.items"
          :key="item.props.prop"
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
          :class="addItemClass(row.showFeature, j, k, row.items.length)">
          <el-form-item v-bind="item.props" v-on="item.events">
            <template v-if="item.tip && item.tip.length" slot="label">
              {{ item.props.label }}
              <el-tooltip>
                <div slot="content"><span v-html="item.tip" /></div>
                <el-button type="text" icon="el-icon-antd-question-circle" />
              </el-tooltip>
            </template>
            <el-form-item-wrap
              v-for="(entity, l) in item.items"
              :key="getKey(entity, l)"
              :value="getModelValue(entity.name)"
              :c-o-m="entity"
              v-bind="entity.props"
              @[inputEvent(entity)]="handleInput($event, entity.name, entity.linkage)"
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
import ElFormItemWrap from '@/components/Typography/Wrap/elFormItemWrap'
import ElButtonWrap from '@/components/Typography/Wrap/elButtonWrap'

export default {
  name: 'ElFormWrap',
  components: { ElFormItemWrap, ElButtonWrap },
  props: {
    COM: {
      type: Object,
      default: function() {
        /*
        item 基于 ComponentObjectModel 扩展
          tip: '提示内容'，为 label 添加提示信息
          linkage: [true | false] 是否为联动组件，为了减少重复渲染，不会实时的将 model 变化 @input 父组件，但是某些组件的值变更会导致 items 变化，这些组件便称为联动组件
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
  beforeMount() {
    window.addEventListener('resize', this.handleResize)
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
    getActionCOM(action) {
      const { tip = '', icon, click = () => {} } = action
      return {
        tip,
        props: { icon, type: 'text' },
        events: { click }
      }
    },
    addGroupClass: function(groupFeature) {
      const classes = []
      if (groupFeature) {
        classes.push('form-group')
      }
      return classes
    },
    addRowTitleClass: function(groupFeature) {
      const classes = ['row-title']
      if (!groupFeature) {
        classes.push('row-title-pl')
      }
      return classes
    },
    firstRowColCount: function(itemCount) {
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
      if (itemCount > colCount) {
        return colCount
      } else {
        return itemCount
      }
    },
    addItemClass: function(showFeature, rowIndex, itemIndex, itemCount) {
      const classes = []
      if ((!showFeature && rowIndex > 0) || itemIndex >= this.firstRowColCount(itemCount)) {
        classes.push('form-item')
      }
      return classes
    },
    inputEvent(entity) {
      let event = 'input'
      const tag = entity.tag
      if (tag === 'el-input-number') {
        event = 'input'
      }
      return event
    },
    handleInput(value, name, linkage) {
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
    resetForm() {
      if (isNotEmpty(this.resetTo)) {
        this.$emit('input', this.resetTo)
      } else {
        this.$refs.ref.resetFields()
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
  float: right;
  margin-top: -1px;
  .el-button--text {
    padding: 0px;
  }
}

.form-item {
  border-top: 1px dashed rgb(235, 238, 245);
}
</style>
