<template>
  <el-submenu v-if="item.children && item.children.length" :index="item.id">
    <template slot="title">
      <i v-if="item.icon && item.icon.length" :class="item.icon" />
      <span slot="title">{{ item.name }}</span>
    </template>
    <subsystembox-item v-for="child in item.children" :key="child.id" :item="child" />
  </el-submenu>
  <el-menu-item v-else :index="item.id">
    <i v-if="item.icon && item.icon.length" :class="item.icon" />
    <span slot="title">{{ item.name }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'SubsystemboxItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
