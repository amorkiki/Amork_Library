<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      active-text-color="#a38eaa"
    >
      <el-breadcrumb-item :to="{ path: '/home' }" active-text-color="#a38eaa"
        >home</el-breadcrumb-item
      >
      <el-breadcrumb-item>tracks</el-breadcrumb-item>
      <el-breadcrumb-item>reading notes</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索&添加区域 -->
      <el-row :gutter="25">
        <el-col :span="12">
          <el-input
            placeholder="searching box..."
            clearable
            @clear="getNotesList()"
          >
            <el-select v-model="selected" slot="prepend" placeholder="请选择">
              <el-option label="书名" value="1"></el-option>
              <el-option label="用户" value="2"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findNotesList(selected)"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="warning" @click="addNewNotes"
            >Add new notes here...</el-button
          >
        </el-col>
      </el-row>
      <!-- 图书列表区域 -->
      <el-table>
        123
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  created() {
    this.getNotesList()
  },
  methods: {
    // 获取笔记列表
    getNotesList() {},
    // 查询笔记
    findNotesList() {},
    // 点击添加跳转到添加页面
    addNewNotes() {
      this.$router.push('readingnotes/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
