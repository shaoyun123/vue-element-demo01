<template>
  <el-button-wrap :c-o-m="COM" />
</template>

<script>
import ElButtonWrap from '@/components/Typography/Wrap/ElButtonWrap'

export default {
  name: 'TyButtonStatus',
  components: { ElButtonWrap },
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
  computed: {
    COM: function() {
      return {
        tip: this.tip,
        props: {
          plain: false,
          ...this.$attrs,
          type: this.type
        },
        events: {
          click: this.toggle
        }
      }
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
