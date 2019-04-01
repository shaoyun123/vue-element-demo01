<template>
  <el-popover v-model="visible">
    <template v-if="device!=='mobile'">
      <error-log />
      <screenfull />
      <size-select />
      <lang-select />
      <!-- theme-picker / -->
    </template>
    <el-button slot="reference" icon="el-icon-antd-CodeSandbox" type="text" class="plugin-box-button" />
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  name: 'Pluginbox',
  components: {
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  },
  methods: {
    toggleSubsystem: function(id) {
      if (this.subsystem !== id) {
        this.$store.dispatch('toggleSubsystem', id)
        this.visible = false
      }
    }
  }
}
</script>

<style scoped>
.plugin-box-button {
  padding: 0px 0px;
  font-size: 48px;
  color: #1f2d3d;
}
.plugin-box-button:hover {
  color: #409EFF;
}
</style>
