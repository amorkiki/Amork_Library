<template>
  <div>
    <!-- 面包屑导航 -->
    {{curBook}}---{{this.notesInfo}}
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      active-text-color="#a38eaa"
    >
      <el-breadcrumb-item :to="{ path: '/home' }" active-text-color="#a38eaa"
        >home</el-breadcrumb-item
      >
      <el-breadcrumb-item>tracks</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/readingnotes' }"
        >reading notes</el-breadcrumb-item
      >
      <el-breadcrumb-item>add notes</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 消息提示 -->
      <el-alert
        title="write down something... ~_~"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="how's today?" icon="iconfont icon-calendar"></el-step>
        <el-step title="what you read?" icon="iconfont icon-column-4"></el-step>
        <el-step title="writing..." icon="iconfont icon-code"></el-step>
        <el-step title="finish" icon="iconfont icon-tradealert"></el-step>
      </el-steps>
      <!-- tab侧边栏区域 -->
      <el-form
        :model="notesInfo"
        label-width="100px"
        label-position="top"
        :rules="addBookInfoRules"
        class="tab-pane-form"
      >
        <el-tabs
          :tab-position="'right'"
          v-model="activeIndex"
          @tab-click="tabClick"
          :before-leave="leaveTab"
        >
          <!-- 第一个tab -->
          <el-tab-pane label="Create Date" name="0">
            <el-form-item>
              <!-- 天气插件 -->
              <div id="weather-v2-plugin-simple"></div>
              <!-- 日期选择器 -->
              <span class="behind-input"
                >Choose date and time for this log...</span
              >
              <el-date-picker
                v-model="notesInfo.dateAndTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="datePickerOptions"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>            
            </el-form-item>
            <el-form-item>
              <!-- 天气单选框 -->
              <span class="behind-input">Choose the weather here...</span>
              <el-radio-group
                v-model="notesInfo.radioWeather"
                @change="clickWeather"
              >
                <el-radio :label="1"
                  ><i class="iconfont icon-qingtian"></i
                ></el-radio>
                <el-radio :label="2"
                  ><i class="iconfont icon-yintian1"></i
                ></el-radio>
                <el-radio :label="3"
                  ><i class="iconfont icon-duoyun"></i
                ></el-radio>
                <el-radio :label="4"><i class="iconfont icon-yu"></i></el-radio>
                <el-radio :label="5"
                  ><i class="iconfont icon-xue"></i
                ></el-radio>
                <el-radio :label="6"
                  ><i class="iconfont icon-yujiaxue"></i
                ></el-radio>
                <el-radio :label="7"
                  ><i class="iconfont icon-dafeng"></i
                ></el-radio>
                <el-radio :label="8"><i class="iconfont icon-wu"></i></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="bottom-btn"
                @click="skipToNext(activeIndex)"
                >Next ↘</el-button
              >
            </el-form-item>
          </el-tab-pane>
          <!-- 第二个tab -->
          <el-tab-pane label="Add to which book?" name="1">
            <!-- 图书信息表单 -->
            <el-form :model="notesInfo" :rules="addBookInfoRules">
              <el-form-item
                label="Book's Name"
                style="width: 80%"
              >
              {{curBook.b_name}}
              </el-form-item>
              <el-form-item
                label="Chapter"
                prop="b_chapters"
                style="width: 80%"
              >
                <el-input v-model="notesInfo.b_chapters"></el-input>
              </el-form-item>
              <el-form-item
                label="Short introduction"
                style="width: 80%"
                prop="intro"
              >
                <el-input v-model="notesInfo.intro"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  class="bottom-btn"
                  @click="skipToNext(activeIndex)"
                  >Next ↘</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 第三个tab -->
          <el-tab-pane label="Reading Notes" name="2">
            <el-form-item style="width: 95%">
              <quill-editor v-model="notesInfo.content" />
              <el-button
                type="primary"
                class="bottom-btn"
                @click="skipToNext(activeIndex)"
                >Next ↘</el-button
              >
            </el-form-item>
          </el-tab-pane>
          <!-- 第四个tab -->
          <el-tab-pane label="Down" name="3">
            <el-form-item>
              <el-card>
                <div>恭喜大人又完成一篇读书笔记啦~</div>
                <div class="finish-img"></div>
              </el-card>
            </el-form-item>
            <el-form-item>
              <el-button type="success" class="bottom-btn" @click="addNewNotes"
                >Finish ↗</el-button
              >
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
// import _ from 'loadash'

export default {
  data() {
    return {
      curUser: this.$store.getters.curUser,
      curBook: this.$store.getters.curBook,
      bookInfo: [],
      // 图片地址
      imgUrl: '../assets/15.jpeg',
      // 步骤条和tab的绑定
      activeIndex: '',
      notesInfo: {},
      // 日期选择
      datePickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      // 图书信息验证规则
      addBookInfoRules: {
        b_chapters: [
          {
            required: true,
            message: 'chapters you wanna refer to ? ',
            trigger: 'blur'
          }
        ],
        intro: [
          {
            required: true,
            message:
              'less than 10 words as a short view ',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 点击Next按钮跳转到下一个tab
    skipToNext() {
      if (this.activeIndex === '0') {
        this.activeIndex = '1'
        this.tabClick('1')
      } else if (this.activeIndex === '1') {
        this.activeIndex = '2'
        this.tabClick('2')
      } else if (this.activeIndex === '2') {
        this.activeIndex = '3'
        this.tabClick('3')
        // this.notesArray()
      }
    },
    // tab栏点击事件
    tabClick(activeIndex) {
      // console.log(activeIndex)
    },
    // 天气单选框
    clickWeather(w) {
      // console.log(w)
      this.notesInfo.radioWeather = w
    },
    // 添加新笔记
    async addNewNotes() {
      // alert(this.curUser.id)
      // alert(this.curBook.b_name)
      const { data: res } = await this.$http.post(
        `/diaries/add/${this.curUser.id}/${this.curBook.b_name}/${this.curUser.name}`,
        this.notesInfo
      )
      console.log(res)
      if (!res) {
        return this.$message.error('提交失败啦>_<')
      }
      this.notesInfo = res
      // console.log(this.notesInfo)
      this.$message.success('提交成功啦^_^')
      this.$router.push('/readingnotes')
    },
    // tabs切换时验证
    leaveTab(val, oldVal) {
      // console.log(typeof val, oldVal)
      const info =  JSON.parse(JSON.stringify(this.notesInfo))
      if (oldVal === '0' && val === '1') {
        // console.log(info)
        if (!info.dateAndTime) {
          this.$message.error('请添加日期')
          return false
        }
      } else if (oldVal === '1' && val === '2') {
        if (!info.intro) {
          this.$message.error('请添加简介')
          return false
        }
      } else if (oldVal === '2' && val === '3') {
        if (!info.content) {
          this.$message.error('还没有任何笔记内容呀')
          return false
        }
      }
    }
  },
  mounted() {
    window.WIDGET = {
      ID: 'Xu64mPZCgn',
      CONFIG: {
        modules: '23014',
        background: 2,
        tmpColor: '4A4A4A',
        tmpSize: '14',
        cityColor: '4A4A4A',
        citySize: '14',
        aqiSize: '14',
        weatherIconSize: '28',
        alertIconSize: '18',
        padding: '10px 12px 10px 10px',
        shadow: '1',
        language: 'en',
        borderRadius: '10',
        fixed: 'false',
        vertical: 'middle',
        horizontal: 'center',
        key: 'NSLwgRjLRZ'
      }
    }
    ;(function(d) {
      var cs = d.createElement('link')
      // cs.rel = 'stylesheet'
      cs.href =
        'https://apip.weatherdt.com/simple/static/js/weather-simple-common.js?v=2.0"'
      var s = d.createElement('script')
      s.src =
        'https://apip.weatherdt.com/simple/static/js/weather-simple-common.js?v=2.0"'
      var sn = d.getElementsByTagName('script')[0]
      sn.parentNode.insertBefore(cs, sn)
      sn.parentNode.insertBefore(s, sn)
    })(document)
  }
}
</script>
<style lang="less" scoped>
.bottom-btn {
  margin-top: 30px;
}
.el-radio-group {
  margin-bottom: 40px;
}
.el-tag {
  margin: 0 10px;
}
.finish-img {
  height: 500px;
  background: url('../../assets/15.jpeg') no-repeat;
  background-size: cover;
}
</style>
