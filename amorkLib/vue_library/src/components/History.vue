<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" active-text-color="#a38eaa">
      <el-breadcrumb-item :to="{ path: '/home' }" active-text-color="#a38eaa">home</el-breadcrumb-item>
      <el-breadcrumb-item>datas</el-breadcrumb-item>
      <el-breadcrumb-item>history line</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="history line" name="first">
          <!-- 折线图盒子 -->
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div id="line" style="width: 900px;height:500px;"></div>
        </el-tab-pane>
        <el-tab-pane label="Calendar" name="second">
          <!-- 饼图盒子 -->
          <div id="calendar" style="width: 900px;height:500px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
// 引入echarts
import echarts from 'echarts'
export default {
  data() {
    return {
      // tab栏切换
      activeName: 'first'
      // echarts
    }
  },
  methods: {
    // tab切换
    handleClick() {}
  },
  created() {},
  mounted() {
    ;(function() {
      var lineChart = echarts.init(document.getElementById('line'))
      var dataAxis = ['自然', '互联网', '文学小说', '语言文字', '艺术鉴赏', '历史', '政经法', '哲学心理', '考试', '外文']
      var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321]
      var colorArr = ['#759AA0', '#E79D86', '#8DC1A9', '#EA7E53', '#EFDE79', '#73A272', '#73BABC', '#7288AC', '#91CA8D', '#F4A042']
      // var yMax = 500
      // var dataShadow = []
      // for (var i = 0; i < data.length; i++) {
      //   dataShadow.push(yMax)
      // }
      var option = {
        title: {
          text: '阅读横向涉猎',
          subtext: 'Reading confers to different kinds'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
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
            data: dataAxis,
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
            data: data
          }
        ]
      }
      lineChart.setOption(option)
    })()
    ;(function() {
      var calenChart = echarts.init(document.getElementById('calendar'))
      function getVirtulData(year) {
        year = year || '2020'
        var date = +echarts.number.parseDate(year + '-01-01')
        var end = +echarts.number.parseDate(+year + 1 + '-01-01')
        var dayTime = 3600 * 24 * 1000
        var data = []
        for (var time = date; time < end; time += dayTime) {
          data.push([echarts.format.formatTime('yyyy-MM-dd', time), Math.floor(Math.random() * 1000)])
        }
        return data
      }
      var option = {
        title: {
          text: '阅读观察',
          subtext: 'Reading tracks day by day'
        },
        tooltip: {
          position: 'top'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: 1000,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          top: 'top'
        },

        calendar: [
          {
            top: 80,
            range: '2020',
            cellSize: ['auto', 25]
          },
          {
            top: 320,
            range: '2019',
            cellSize: ['auto', 25]
          }
        ],
        series: [
          {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            data: getVirtulData(2020)
          },
          {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 1,
            data: getVirtulData(2019)
          }
        ]
      }

      calenChart.setOption(option)
    })()
  }
}
</script>
<style lang="less" scoped></style>
