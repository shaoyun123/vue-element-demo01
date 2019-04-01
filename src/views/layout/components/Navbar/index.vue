<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <pluginbox class="right-menu-item hover-effect" />
      <subsystembox class="right-menu-item hover-effect" />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="resync">同步</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="changePassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <change-password ref="ref-change-password" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Pluginbox from './Pluginbox'
import Subsystembox from './Subsystembox'
import ChangePassword from './ChangePassword'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Pluginbox,
    Subsystembox,
    ChangePassword
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    resync() {
      // 刷新当前页面便可重新同步用户信息
      this.$confirm('是否重新同步用户信息 ？', {
        type: 'warning',
        confirmButtonClass: 'el-icon-antd-check',
        confirmButtonText: '是',
        showCancelButton: false
      }).then(() => {
        location.reload()
      }).catch(() => {})
    },
    changePassword() {
      this.$refs['ref-change-password'].showDialog()
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        // In order to re-instantiate the vue-router object to avoid bugs
        location.reload()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .breadcrumb-container{
    float: left;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
