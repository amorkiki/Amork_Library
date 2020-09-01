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
            <el-select slot="prepend" placeholder="请选择">
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
      <el-table :data="notesInfo" style="width: 100%" border>
        <el-table-column type="index" width="30px"> </el-table-column>
        <el-table-column
          label="User"
          prop="user"
          width="90px"
        ></el-table-column>
        <el-table-column label="Date" prop="dateAndTime"></el-table-column>
        <el-table-column label="Books" prop="b_name"></el-table-column>
        <el-table-column label="Content" prop="content"></el-table-column>
        <el-table-column label="Control"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 读书笔记信息
      notesInfo: {
        user: '',
        // 时间选择器
        dateAndTime: '',
        // 天气单选框
        radioWeather: '',
        b_name: '',
        content: ''
      },
      total: 0
    }
  },
  created() {
    this.getNotesList()
  },
  methods: {
    // 获取笔记列表
    async getNotesList() {
      const res = await this.$http.get('/diaries')
      // console.log(res.data)
      if (res.status !== 200) return this.$message.error('获取列表失败>_<')
      this.notesInfo = res.data
      this.total = res.data.length
    },
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
