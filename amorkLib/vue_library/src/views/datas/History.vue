<template>
  <div>
    <!-- 面包屑导航 -->
    <am-crumbs pre="datas" cur="history line"></am-crumbs>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="history line" name="first">
          <!-- 折线图盒子 -->
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div id="line" style="width: 900px;height:500px;" ref="firstchart"></div>
        </el-tab-pane>
        <el-tab-pane label="Calendar" name="second">
          <!-- 日历盒子 -->
          <div id="calendar" style="width: 900px;height:500px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import amCrumbs from '../../components/cmps/breadCrumb'
// 引入echarts
import echarts from 'echarts'

export default {
  components: { amCrumbs },
  data() {
    return {
      // tab栏切换
      activeName: 'first',
      // 获取当前用户信息
      curUser: this.$store.getters.curUser,
      // 创建者信息
      creator: this.$store.getters.creator,
      historyCate: {},
      // 横坐标图书类型
      axisCate: [],
      // 纵坐标类型的数量
      axisCateData: [],
      // 日志日历
      logDate: []
      
    }
  },
  methods: {
    // tab切换
    handleClick() {
      // this.getCalenDate()
    },
    // history柱状图目录
    async getHisCate() {
      var arr = []
      if (this.curUser.role === 'manager' ||  this.creator.role === 'manager' || this.curUser.role === 'common') {
        const { data: res } = await this.$http.get(
        `profiles/${this.curUser.role}/${this.curUser.id}`)  
        if (res.meta.status !== 200) {
          return this.$message.error('这里没啥内容@_@')
        }
        // console.log(res.data)
        this.historyCate = res.data
      } 
      if (this.creator.role === 'common') {
        const { data: res } = await this.$http.get(
        `profiles/${this.creator.role}/${this.creator.id}`)
        this.historyCate = res.data
        if (res.meta.status !== 200) {
          return this.$message.error('这里没啥内容@_@')
        }
      }
      // 遍历处数据内部type的属性，存到arr中
      Array.from(this.historyCate).forEach(ele => {
        for (const name in ele) {
          if (name === 'type') {
            arr.push(ele[name])
          }
        }
      })
      // console.log(arr instanceof Array) // true---arr是Array类型 
      // console.log(arr) // ["前端", "前端", "前端", "前端", "前端", "前端", "建筑", "小说", "前端", "前端", "外文", "考试", "心理学", "经济", "报刊评论", "宗教"]
      this.historyCate = arr.reduce((obj, name) => {
        if (name in obj) {
          obj[name]++
        } else {
          obj[name] = 1
        }
        return obj
      }, {})
      // console.log(this.historyCate) // [前端: 8, 建筑: 1, 小说: 1, 外文: 1, 考试: 1, …]
      // console.log(typeof this.historyCate.前端) // number
      // console.log(this.historyCate instanceof Array) // true---类型是Array,length 是0
      for (const key in this.historyCate) {
        this.axisCate.push(key) 
      }
      // console.log(this.axisCate instanceof Array) // true ---Array类型
      // console.log(this.axisCate) // ["前端", "建筑", "小说", "外文", "考试", "心理学", "经济", "报刊评论", "宗教", __ob__: Observer]
      for (let m = 0; m < this.axisCate.length; m++) {
        const n = this.axisCate[m]
        // console.log(n)
        // console.log(this.historyCate[n])
        this.axisCateData.push(this.historyCate[n])
      }
      // console.log(this.axisCateData) // [8, 1, 1, 1, 1, 1, 1, 1, 1, __ob__: Observer]
    },
    // 绘制historyline图
    async getHisLine() {
      var lineChart = echarts.init(document.getElementById('line'))
      lineChart.showLoading({
        text: '客官莫慌 >_< 数据正在努力加载中...',
        color: '#73BABC',
        textColor: '#73BABC',
        spinnerRadius: 10,
        lineWidth: 3
      })
      // 等待拿到数据后再进行渲染
      await this.getHisCate()
      var colorArr = ['#759AA0', '#E79D86', '#8DC1A9', '#EA7E53', '#EFDE79', '#73A272', '#73BABC', '#7288AC', '#91CA8D', '#F4A042']
      
      lineChart.setOption({
        title: {
          text: '阅读横向涉猎',
          subtext: 'Reading confers to different kinds'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.axisCate,
            axisLabel: {
              fontSize: '11',
              color: '#999'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          }
        ],
        series: [
          {
            // For shadow
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '35%',
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              color: function(params) {
                return colorArr[params.dataIndex]
              },
              barBorderRadius: 2
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#003366' },
                  { offset: 0.7, color: '#003366' },
                  { offset: 1, color: '#4cabce' }
                ])
              }
            },
            data: this.axisCateData
          }
        ]
      })
      lineChart.hideLoading()
    },
    // calendar日志信息
    async getCalenDate() {
      const res = await this.$http.get(
        `/diaries/${this.curUser.role}/${this.curUser.id} `
      )
      // console.log(res.data)
      if (res.status !== 200) return this.$message.error('获取列表失败>_<')
      Array.from(res.data).forEach(ele => {
        for (const val in ele) {
          if (val === 'dateAndTime') {
            this.logDate.push(ele[val])
          }
        }
      })
      this.logData = this.logDate.sort()
      // alert('aaa')
    },
    // 绘制calendar图
    async getCanlendar() {
      var calenChart = echarts.init(document.getElementById('calendar'))
      await this.getCalenDate()
      var mydate = new Date()
      var myyear = mydate.getFullYear()  // 2020
      var log = this.logData
      function getData() {
        var start = Date.parse(myyear) // 把字符串转换为Date对象 ，然后返回此Date对象与'1970/01/01 00:00:00'之间的毫秒值
        var end = Date.parse((myyear + 1) + '-01-01')
        // console.log(start, end)
        var data = []
        var dayTime = 3600 * 24 * 1000 // 一天24小时的毫秒值
        var count = 0 // 累计每天的日志数量
        for (var time = start; time < end; time += dayTime) {
          count = 0
          for (var i = 0; i < log.length; i++) {
            if (echarts.format.formatTime('yyyy-MM-dd', time) === log[i]) {
              // console.log(log[i])
              count++
              // console.log(count)
            } else if (echarts.format.formatTime('yyyy-MM-dd', time) !== log[i]) {
            }
          }
          data.push([echarts.format.formatTime('yyyy-MM-dd', time), count])
        }
        console.log(data)
        return data
      }
      var option = {
        title: {
          top: 30,
          left: 'center',
          text: myyear + ' 年 日志年历'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        visualMap: {
          inRange: {
            color: ['#F2F4F6', '#EFDE79', '#73BABC', '#7288AC', '#91CA8D', '#F4A042']
          },
          min: -1,
          max: 5,
          calculable: true,
          splitNumber: 6,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65,
          textStyle: {
            color: '#000'
          }
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 25],
          range: '2020',
          itemStyle: {
            borderWidth: 0.8
          },
          yearLabel: { show: true }
        },
        series: [{
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: getData()
        }]
      }
      calenChart.setOption(option)
    }
  },
  created() {
  },
  mounted() {
    this.getHisLine()
    this.getCanlendar()
  }
}
</script>
<style lang="less" scoped></style>
