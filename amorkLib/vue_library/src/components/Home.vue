<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header class="">
      <span>Welcome to your reading tracking system ^_^</span>
      <el-button type="info" @click="logout"> Esc</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边导航 -->
      <el-aside :width="isCollapse ? '64px' : '220px'" class="aside_container">
        <div class="switch_btn" @click="toggerCollapse">
          <i class="iconfont icon-column"></i>
        </div>
        <!-- 侧边栏菜单部分 -->
        <el-menu
          background-color="#484664"
          text-color="#fff"
          active-text-color="#a38eaa"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            :key="item.id"
            v-for="item in menulist"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.m_name }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              :key="subItem.id"
              v-for="subItem in item.children"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[subItem.id]"></i>
                <!-- 文本 -->
                <span>{{ subItem.sbm_name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [
        {
          id: 1,
          m_name: 'users',
          path: null,
          children: [
            {
              id: 11,
              sbm_name: 'userlist',
              path: 'users'
            }
          ]
        },
        {
          id: 2,
          m_name: 'books',
          path: null,
          children: [
            {
              id: 21,
              sbm_name: 'booklist',
              path: null
            },
            {
              id: 22,
              sbm_name: 'category',
              path: null
            }
          ]
        },
        {
          id: 3,
          m_name: 'tracks',
          path: null,
          children: [
            {
              id: 31,
              sbm_name: 'reading tracks',
              path: null
            },
            {
              id: 32,
              sbm_name: 'reading notes',
              path: null
            }
          ]
        },
        {
          id: 4,
          m_name: 'datas',
          path: null
        }
      ],
      iconsObj: {
        1: 'iconfont icon-Customermanagement',
        2: 'iconfont icon-Moneymanagement',
        3: 'iconfont icon-agriculture',
        4: 'iconfont icon-data',
        11: 'iconfont icon-usercenter',
        21: 'iconfont icon-category',
        22: 'iconfont icon-libra',
        31: 'iconfont icon-tradingvolume',
        32: 'iconfont icon-attachent'
      },
      isCollapse: false,
      // 保存的激活链接地址
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggerCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #484664;
  display: flex;
  justify-content: space-between;
  padding: 25px;
  color: #fff;
  align-items: center;
  > span {
    margin-left: 10px;
    text-align: center;
    line-height: 60px;
    font-size: 25px;
    font-family: Marker Felt;
  }
}
.el-aside {
  background-color: #484664;
  height: 100%;
  font-family: Marker Felt;
  color: #fff;
  .el-menu {
    border-right: none;
    .el-submenu span {
      font-size: 20px;
    }
  }
}
.switch_btn {
  text-align: center;
  color: #eee;
  cursor: pointer;
}
.iconfont {
  margin-right: 10px;
  color: #fff;
}
</style>
