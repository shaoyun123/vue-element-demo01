<template>
  <el-tooltip v-if="tip && tip.length" :content="tip">
    <el-button v-bind="$attrs" :type="type" v-on="$listeners" @click="toggle" />
  </el-tooltip>
  <el-button v-else v-bind="$attrs" :type="type" v-on="$listeners" @click="toggle" />
</template>

<script>
export default {
  name: 'TypographyButtonStatus',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: ''
    },
    selected: {
      type: String,
      default: 'primary'
    },
    unselected: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      type: this.value ? this.selected : this.unselected
    }
  },
  methods: {
    toggle: function() {
      if (this.value) {
        this.type = this.unselected
      } else {
        this.type = this.selected
      }
      this.$emit('update:value', !this.value)
    }
  }
}
</script>
