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
      <el-form label-width="100px" label-position="top">
        <el-tabs
          tab-position="right"
          v-model="activeIndex"
          @tab-click="tabClick"
        >
          <!-- 第一个tab -->
          <el-tab-pane label="Date and Time" name="0">
            <el-form class="tab-pane-form">
              <!-- 天气插件 -->
              <div id="weather-v2-plugin-simple"></div>
              <!-- 日期选择器 -->
              <el-date-picker
                v-model="notesInfo.dateAndTime"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="datePickerOptions"
              >
              </el-date-picker>
              <span class="behind-input"
                >Choose date and time for this log...</span
              >
              <!-- 天气单选框 -->
              <el-radio-group v-model="notesInfo.radioWeather">
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
              <span class="behind-input">Choose the weather here...</span>
              <el-button
                type="primary"
                class="bottom-btn"
                @click="skipToNext(activeIndex)"
                >Next ↘</el-button
              >
            </el-form>
          </el-tab-pane>
          <!-- 第二个tab -->
          <el-tab-pane label="Add to which book?" name="1">
            <el-form class="tab-pane-form" :rules="addBookInfoRules">
              <!-- 图书信息表单 -->
              <el-form-item label="About Book's Name" prop="b_name">
                <el-input v-model="notesInfo.b_name"></el-input>
              </el-form-item>
              <el-form-item label="About Book's Author" prop="b_author">
                <el-input v-model="notesInfo.b_author"></el-input>
              </el-form-item>
              <el-form-item label="About Chapters" prop="b_chapters">
                <el-input v-model="notesInfo.b_chapters"></el-input>
              </el-form-item>
              <el-form-item label="Add remarks">
                <el-input v-model="notesInfo.b_remarks"></el-input>
              </el-form-item>
              <el-button
                type="primary"
                class="bottom-btn"
                @click="skipToNext(activeIndex)"
                >Next ↘</el-button
              >
            </el-form>
          </el-tab-pane>
          <!-- 第三个tab -->
          <el-tab-pane label="Reading Notes" name="2">
            <el-form class="tab-pane-form">
              <quill-editor v-model="notesInfo.content" />
              <el-button
                type="primary"
                class="bottom-btn"
                @click="skipToNext(activeIndex)"
                >Next ↘</el-button
              >
            </el-form>
          </el-tab-pane>
          <!-- 第四个tab -->
          <el-tab-pane label="Down" name="3">
            <el-form class="tab-pane-form">
              <el-row :gutter="20">
                <el-col :span="7"><div>date</div></el-col>
                <el-col :span="5"><div>weather</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6"><div>book name</div></el-col>
                <el-col :span="6"><div>author</div></el-col>
                <el-col :span="6"><div>chapter</div></el-col>
                <el-col :span="6"><div>remark</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6"><div>book notes</div></el-col>
              </el-row>
              <el-button type="success" class="bottom-btn">Finish ↗</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 步骤条和tab的绑定
      activeIndex: '',
      notesInfo: {
        // 时间选择器
        dateAndTime: '',
        // 天气单选框
        radioWeather: '',
        b_name: '',
        b_chapters: '',
        b_author: '',
        content: ''
      },
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
      addBookInfoRules: {
        b_name: [
          {
            required: true,
            message: 'which book you wanna refer to ?',
            trigger: 'blur'
          }
        ],
        b_author: [
          { required: true, message: 'who write this book ? ', trigger: 'blur' }
        ],
        b_chapters: [
          {
            required: true,
            message: 'what chapters you wanna refer to ? ',
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
      }
    },
    // tab栏点击事件
    tabClick(activeIndex) {
      console.log(activeIndex)
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col div {
  box-sizing: border-box;
  background: #f4f4f5;
  border-radius: 8px;
  min-height: 40px;
  line-height: 30px;
  padding: 5px 10px;
}
</style>
