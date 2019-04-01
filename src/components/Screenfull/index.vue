<template>
  <el-tooltip :content="$t('navbar.screenfull')" placement="top">
    <el-button :icon="isFullscreen ? 'el-icon-antd-fullscreen-exit' : 'el-icon-antd-fullscreen'" class="size-button" @click="click" />
  </el-tooltip>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
</script>

<style scoped>
.size-button {
  padding: 1px;
  font-size: 36px;
}
</style>
