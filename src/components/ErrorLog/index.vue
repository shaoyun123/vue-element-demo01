<template>
  <span v-if="errorLogs.length===0">
    <el-badge :is-dot="true" style="margin-top: -20px;" @click.native="dialogTableVisible=true">
      <el-tooltip content="异常日志" placement="top">
        <el-button type="danger" plain icon="el-icon-antd-bug" class="size-button" />
      </el-tooltip>
    </el-badge>
    <el-dialog :visible.sync="dialogTableVisible" append-to-body title="异常日志" width="80%">
      <el-table :data="errorLogs" border>
        <el-table-column label="Message">
          <template slot-scope="scope">
            <div>
              <span class="message-title">Msg:</span>
              <el-tag type="danger">{{ scope.row.err.message }}</el-tag>
            </div>
            <br>
            <div>
              <span class="message-title" style="padding-right: 10px;">Info: </span>
              <el-tag type="warning">{{ scope.row.vm.$vnode.tag }} error in {{ scope.row.info }}</el-tag>
            </div>
            <br>
            <div>
              <span class="message-title" style="padding-right: 16px;">Url: </span>
              <el-tag type="success">{{ scope.row.url }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template slot-scope="scope">
            {{ scope.row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: 'ErrorLog',
  data() {
    return {
      dialogTableVisible: false
    }
  },
  computed: {
    errorLogs() {
      return this.$store.getters.errorLogs
    }
  }
}
</script>

<style scoped>
.size-button {
  padding: 1px;
  font-size: 36px;
}
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
</style>
