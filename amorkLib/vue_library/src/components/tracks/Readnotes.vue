<template>
  <div>
    <!-- 面包屑导航 -->
    <am-crumbs pre="tracks" cur="reading notes"></am-crumbs>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索&添加区域 -->
      <el-row :gutter="25">
        <el-col :span="12">
          <el-input
            placeholder="searching box..."
            v-model="queryInfo.query"
            clearable
            @clear="getNotesList()"
          >
            <el-select v-model="selected" slot="prepend" placeholder="请选择">
              <el-option label="书名" value="1"></el-option>
              <el-option label="用户" value="2"></el-option>
              <el-option label="创建日期" value="3"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findNotesList(selected)"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 日记列表区域 -->
      <el-table :data="notesInfo" style="width: 100%" border stripe>
        <el-table-column type="index" width="35px"> </el-table-column>
        <el-table-column label="Creator" width="100px">{{
          curUser.name
        }}</el-table-column>
        <el-table-column
          label="Date"
          prop="dateAndTime"
        ></el-table-column>
        <el-table-column label="Weather" width="100px">
          <template slot-scope="scope"> 
            <i class="iconfont icon-qingtian" v-if="scope.row.radioWeather==='1'"></i>
            <i class="iconfont icon-yintian" v-if="scope.row.radioWeather==='2'"></i>
            <i class="iconfont icon-duoyun" v-if="scope.row.radioWeather==='3'"></i>
            <i class="iconfont icon-yu" v-if="scope.row.radioWeather==='4'"></i>
            <i class="iconfont icon-xue" v-if="scope.row.radioWeather==='5'"></i>
            <i class="iconfont icon-yujiaxue" v-if="scope.row.radioWeather==='6'"></i>
            <i class="iconfont icon-dafeng" v-if="scope.row.radioWeather==='7'"></i>
            <i class="iconfont icon-wu" v-if="scope.row.radioWeather==='8'"></i>
          </template>
        </el-table-column>
        <el-table-column label="Books" prop="b_name"></el-table-column>
        <el-table-column label="Chapter" prop="b_chapters" width="100px"></el-table-column>
        <el-table-column label="shortIntro" prop="intro"></el-table-column>
        <el-table-column label="Control">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="edit"
              placement="top"
              :enterable="false"
            >
              <el-button type="text">
                <i class="iconfont icon-unlock" style="color: #91ca8d"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="delete"
              placement="top"
              :enterable="false"
              ><el-button type="text">
                <i
                  class="iconfont icon-ashbin1"
                  style="color: #ea7e53"
                  @click="delNotes(scope.row._id)"
                ></i> </el-button
            ></el-tooltip>
            <el-tooltip
              effect="dark"
              content="share"
              placement="top"
              :enterable="false"
              ><el-button type="text">
                <i
                  class="iconfont icon-link"
                  style="color: #7288ac"
                ></i> </el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import amCrumbs from '../cmps/breadCrumb'
export default {
  components: { amCrumbs },
  data() {
    return {
      curUser: this.$store.getters.curUser,
      // 读书笔记信息
      notesInfo: [],
      total: 0,
      // 获取列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 已选中的查询方式
      selected: ''
    }
  },
  created() {
    this.getNotesList()
  },
  methods: {
    // 获取笔记列表
    async getNotesList() {
      const res = await this.$http.get(
        `/diaries/${this.curUser.role}/${this.curUser.id} `
      )
      console.log(res.data)
      if (res.status !== 200) return this.$message.error('获取列表失败>_<')
      this.notesInfo = res.data
      this.total = res.data.length
    },
    // 查询笔记
    async findNotesList(selected) {
      const { data: res } = await this.$http(
        `/diaries/find/${selected}/${this.queryInfo.query}`
      )
      console.log(res)
      if (res.data.length === 0 || res.meta.status !== 200) {
        this.$message.error('没找到任何内容哦>_<')
        this.notesInfo = res.data
      }
      this.notesInfo = res.data
    },

    // 删除笔记
    async delNotes(id) {
      console.log(id)
      // 弹窗提示
      const confirmResult = await this.$confirm(
        '确定要永久删除这条信息嘛+_+?',
        '警告',
        {
          confirmButtonText: 'yes',
          cancelButtonText: 'no',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('取消删除=_=')
      } else {
        await this.$http.delete('/diaries/delete/' + id)
        // console.log(res)
        this.$message.success('删除成功>_<')
      }
      this.getNotesList()
    }
  }
}
</script>
<style lang="less" scoped></style>
