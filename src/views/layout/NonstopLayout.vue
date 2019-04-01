<template>
  <div :class="classObj" class="app-wrapper">
    <app-main/>
  </div>
</template>

<script>
import { AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'NonstopLayout',
  components: {
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        mobile: this.device === 'mobile'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
