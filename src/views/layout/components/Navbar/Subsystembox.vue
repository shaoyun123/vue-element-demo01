<template>
  <el-popover v-model="visible">
    <el-menu :default-active="subsystem" mode="horizontal" @select="toggleSubsystem">
      <subsystembox-item v-for="item in subsystems" :key="item.id" :item="item" />
    </el-menu>
    <el-button slot="reference" icon="el-icon-antd-appstore" type="text" class="subsystem-box-button" />
  </el-popover>
</template>

<script>
import SubsystemboxItem from './SubsystemboxItem'

export default {
  name: 'SubSystembox',
  components: { SubsystemboxItem },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    subsystem: function() {
      return this.$store.getters.subsystem
    },
    subsystems: function() {
      return this.$store.getters.accessedSubsystems
    }
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
.subsystem-box-button {
  padding: 0px 0px;
  font-size: 48px;
  color: #1f2d3d;
}
.subsystem-box-button:hover {
  color: #409EFF;
}
</style>
