<template>
  <div>
    <!-- 面包屑导航 -->
    {{curUser}}-------
    
    <am-crumbs pre="tracks" cur="reading tracks"></am-crumbs>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 列表 -->
    <am-table :tableData="bookList" :loading="loading" :total="total" @add="addNewNotes" @show="showRead" @change="changeCur" :color='customColorMethod'></am-table>
    </el-card>
    <!-- 更改当前页弹出框 -->
    <el-dialog
      title="今天读到那一页啦？@_@"
      :visible.sync="pageDialogVisible"
      width="500px"
    >
      <el-input
        prefix-icon="el-icon-s-operation"
        style="font-size: 18px"
        v-model="current_p"
        ref="saveInputRef"
        @keyup.enter.native="handleInputConfirm"
      >
        <el-button
          slot="append"
          icon="el-icon-check"
          width="50px"
          @click="handleInputConfirm"
        ></el-button>
      </el-input>
    </el-dialog>
    <!-- log时间线弹出框 -->
    <el-dialog
      title="Book's Reading-Track Steps"
      :visible.sync="readDialogVisible"
      width="60%"
    >
      <!-- 时间线组件 -->
      <el-timeline>
        <el-timeline-item
          v-for="(readingSteps, index) in readingSteps"
          :key="index"
          :timestamp="readingSteps.dateAndTime"
          placement="top"
          icon="iconfont icon-arrow-up"
          v-loading="loading"
        >
          <el-card>
            <h3>Update {{ readingSteps.b_name }}</h3>
            <h4>update chapter: {{ readingSteps.b_chapters }}</h4>
            <p>about: {{readingSteps.intro}}</p>
            <p>Submit at {{ readingSteps.dateAndTime }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <!-- 底部按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="readDialogVisible = false">
          hide
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import amCrumbs from '../../components/cmps/breadCrumb'
import amTable from '../../components/tracks/Track-table'
export default {
  components: { amCrumbs, amTable },
  data() {
    return {
      loading: false,
      curUser: this.$store.getters.curUser,
      bookList: [],
      total: 0,
      // 点击修改页数是拿到的书的pages
      current_pages: 0,
      // current page 拿到的值
      current_p: 0,
      // current page拿到的当前id
      id: '',
      // current_p对话框默认隐藏
      pageDialogVisible: false,
      // 进度条默认
      percentage: 0,
      // 进度条百分比和颜色
      readDialogVisible: false,
      // 阅读进度时间戳
      readingSteps: []
    }
  },
  created() {
    this.getBookList()
  },
  methods: {
    // 获取图书列表
    async getBookList() {
      this.loading = true
      const { data: res } = await this.$http.get(
        `profiles/${this.curUser.role}/${this.curUser.id}`,
        {
          params: this.queryInfo
        }
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        this.loading = false
        return this.$message.error('这里没啥内容@_@')
      }
      this.loading = false
      this.bookList = res.data
      this.total = res.data.length
      // console.log(this.bookList)
      this.pageArr = this.bookList.map(key => key.pages)
      // console.log(this.newArr[3])
    },
    
    // 进度条颜色变化
    customColorMethod(percentage) {
      if (percentage < 20) {
        return '#f56c6c'
      } else if (percentage < 50) {
        return '#e6a23c'
      } else if (percentage < 90) {
        return '#6f7ad3'
      } else {
        return '#5cb87a'
      }
    },
    
    // 点击确定更改阅读进度按钮
    async handleInputConfirm(id) {
      this.pageDialogVisible = false
      if (this.current_p !== 0 && this.current_pages !== 0) {
        const p = Math.round((this.current_p / this.current_pages) * 100)
        // console.log(p)
        if (p >= 100) {
          this.percentage = 100
        } else {
          this.percentage = p
        }
      } else {
        this.percentage = 0
      }
      // console.log(typeof this.percentage) number
      // 发起请求，编辑图书信息
      const { data: res } = await this.$http.put('/profiles/edit/' + this.id, {
        current_p: this.current_p,
        progress: this.percentage
      })
      console.log(res)
      if (res.meta.status !== 200) this.$message.error('更改失败了>_<')
      this.$message.success('更新成功>_<')
      this.getBookList()
    },
    
    // 更改当前页弹出框
    async changeCur(id) {
      // console.log(id)
      // 拿到id后发送请求，拿到当前id的current_p的值
      const { data: res } = await this.$http.get('/profiles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取不到任何信息!!>_<')
      }
      console.log(res.data.current_p)
      this.current_p = res.data.current_p
      this.current_pages = res.data.pages
      this.id = res.data._id
      this.pageDialogVisible = true
    },

    // 显示阅读进度按钮
    async showRead(val) {
      this.loading = true
      this.readDialogVisible = true
      // alert(val)书名
      const { data: res } = await this.$http.get(
        `/diaries/find/1/${val} `
      )
      console.log(res.data)
      if (res.data.length <= 0) {
        this.readingSteps = []
        this.loading = false
        this.$message.error('获取笔记列表失败>_<') 
        return 
      }
      this.loading = false
      this.readingSteps = res.data
    },

    // 点击添加跳转到添加页面
    addNewNotes(scope) {
      console.log(scope)
      this.loading = true
      // const { data: res } = await this.$http(`/profiles/find/1/${scope.b_name}`)
      // console.log(res.data)
      this.$store.dispatch('getCurBook', scope)
      this.$router.push('/readingnotes/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
