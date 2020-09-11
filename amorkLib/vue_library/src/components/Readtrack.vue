<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" active-text-color="#a38eaa">
      <el-breadcrumb-item :to="{ path: '/home' }" active-text-color="#a38eaa"
        >home</el-breadcrumb-item
      >
      <el-breadcrumb-item>tracks</el-breadcrumb-item>
      <el-breadcrumb-item>reading tracks</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 列表 -->
      <el-table :data="bookList" border style="width: 100%">
        <el-table-column type="index" width="40px"> </el-table-column>
        <el-table-column prop="type" label="Type" width="60px"> </el-table-column>
        <el-table-column prop="b_name" label="Name"> </el-table-column>
        <el-table-column prop="pages" label="Pages" width="80px">
          <template slot-scope="scope">
            <!-- 总页数标签 -->
            <el-tag type="info" size="large" effect="dark">
              {{ scope.row.pages }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Current" width="80px">
          <!-- 当前页数 -->
          <template slot-scope="scope">
            <el-input
              v-if="inputVisible"
              v-model="current_p"
              ref="saveInputRef"
              size="small"
              @keyup.enter.native="handleInputConfirm(current_p, scope.row._id, scope.$index)"
              @blur="handleInputConfirm(current_p, scope.row._id, scope.$index)"
              >{{ scope.row.current_p }}
            </el-input>
            <el-tooltip
              effect="light"
              content="update current pages"
              placement="top"
              :enterable="false"
              v-else
            >
              <el-button
                type="success"
                class="iconfont icon-exchangerate"
                size="mini"
                plain
                @click="showInput"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 进度条栏 -->
        <el-table-column label="Progress">
          <template slot-scope="scope">
            <el-progress
              :percentage="scope.row.progress"
              :color="customColorMethod"
              :stroke-width="12"
              text-inside
            ></el-progress>
          </template>
        </el-table-column>
        <!-- 明细栏 -->
        <el-table-column label="Show Details" width="220px">
          <template slot-scope>
            <el-tooltip
              effect="light"
              content="show reading progress"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="iconfont icon-pin"
                size="mini"
                plain
                @click="showRead"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="show writing progress"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="iconfont icon-writing" size="mini" plain></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 阅读进度弹出框 -->
    <el-dialog title="Book's Reading-Track Steps" :visible.sync="readDialogVisible" width="40%">
      <!-- 时间线组件 -->
      <el-timeline>
        <el-timeline-item
          v-for="(readingSteps, index) in readingSteps"
          :key="index"
          :timestamp="readingSteps.timestamp"
          icon="iconfont icon-arrow-up"
          size="large"
        >
          {{ readingSteps.progress }}
        </el-timeline-item>
      </el-timeline>
      <!-- 底部按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="readDialogVisible = false">
          hide
        </el-button>
      </div>
    </el-dialog>
    <!-- 阅读笔记明细  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      bookList: [],
      // bookList里的pages转换成的数组
      pageArr: [],
      // bookList里的current_p转换成的数组
      currentArr: [],
      // current_p输入框默认隐藏
      inputVisible: false,
      // 进度条默认
      percentage: 0,
      // current page 拿到的值
      current_p: 0,
      // 进度条百分比和颜色
      readDialogVisible: false,
      // 阅读进度时间戳
      readingSteps: [{ progress: '', timestamp: '' }]
    }
  },
  created() {
    this.getBookList()
  },
  methods: {
    // 获取图书列表
    async getBookList() {
      const { data: res } = await this.$http.get('profiles', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('这里没啥内容@_@')
      }
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
      } else if (percentage < 95) {
        return '#6f7ad3'
      } else {
        return '#5cb87a'
      }
    },
    // 点击确定更改阅读进度按钮
    async handleInputConfirm(val, id, i) {
      // console.log(val)
      // console.log(id)
      // console.log(i)
      this.current_p = val
      this.inputVisible = false
      console.log(this.current_p)
      if (this.current_p !== 0 && this.pageArr[i] !== 0) {
        const p = Math.round((this.current_p / this.pageArr[i]) * 100)
        // console.log(p)
        if (p >= 100) {
          this.percentage = 100
        } else {
          this.percentage = p
        }
      } else {
        this.percentage = 0
      }
      // console.log(typeof this.percentage)
      // 发起请求，编辑图书信息
      const { data: res } = await this.$http.put('/profiles/edit/' + id, {
        current_p: this.current_p,
        progress: this.percentage
      })
      console.log(res)
      if (res.meta.status !== 200) this.$message.error('更改失败了>_<')
      this.$message.success('更新成功>_<')
      this.getBookList()
    },
    // current_p输入框在点击按钮后打开
    showInput() {
      this.inputVisible = true
    },

    // 显示阅读进度按钮
    showRead() {
      this.readDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
