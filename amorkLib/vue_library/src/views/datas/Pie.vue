<template>
  <div>
    <!-- 面包屑导航 -->
    <am-crumbs pre="datas" cur="category pie">category pie</am-crumbs>

    <!-- 卡片视图区 -->
    <el-card>
      <div id="pie" style="width: 900px;height:500px;"></div>
    </el-card>
  </div>
</template>
<script>
import amCrumbs from '../../components/cmps/breadCrumb'
import echarts from 'echarts'
export default {
  components: { amCrumbs },
  data() {
    return {
      // 获取当前用户信息
      curUser: this.$store.getters.curUser,
      // 创建者信息
      creator: this.$store.getters.creator,
      // store里的完整目录json数据
      totalCate: this.$store.getters.totalCate,
      // 每个type出现的次数
      pieCate: [],
      // 共有那些type
      cateName: [],
      // 饼图数据
      pieData: []
    }
  },
  methods: {
    async getPieCate() {
      var arr = []
      if (this.curUser.role === 'manager' ||  this.creator.role === 'manager' || this.curUser.role === 'common') {
        const { data: res } = await this.$http.get(
        `profiles/${this.curUser.role}/${this.curUser.id}`)  
        if (res.meta.status !== 200) {
          return this.$message.error('这里没啥内容@_@')
        }
        // console.log(res.data)
        this.pieCate = res.data
      } 
      if (this.creator.role === 'common') {
        const { data: res } = await this.$http.get(
        `profiles/${this.creator.role}/${this.creator.id}`)
        this.pieCate = res.data
        if (res.meta.status !== 200) {
          return this.$message.error('这里没啥内容@_@')
        }
      }
      // 遍历处数据内部type的属性，存到arr中
      Array.from(this.pieCate).forEach(ele => {
        for (const name in ele) {
          if (name === 'type') {
            arr.push(ele[name])
          }
        }
      })
      // console.log(arr)  // ["前端", "前端", "前端", "前端", "前端", "前端", "建筑", "小说", "前端", "前端", "外文", "考试", "心理学", "经济", "报刊评论", "宗教", "书画", "外文"]
      // 每个type出现的次数 
      this.pieCate = arr.reduce((obj, name) => {
        if (name in obj) {
          obj[name]++
        } else {
          obj[name] = 1
        }
        return obj
      }, {})
      console.log(this.pieCate) // {'前端':8,'考试':1, ...}
      // type组成的数组
      for (const key in this.pieCate) {
        this.cateName.push(key)
      }
      this.cateName = this.cateName.sort()
      console.log(this.cateName)// ['前端', '物理', '小说', '考试', '外文']
      // 循环得出type的name和次数value
      for (let i = 0; i < this.cateName.length; i++) {
        this.pieData.push({ 
          name: this.cateName[i],
          value: this.pieCate[this.cateName[i]]
        })
      }
    },
    // 渲染饼图
    async getPieData() {
      var pieChart = echarts.init(document.getElementById('pie'))
      pieChart.showLoading({
        text: '客官莫慌 >_< 数据正在努力加载中...',
        color: '#73BABC',
        textColor: '#73BABC',
        spinnerRadius: 10,
        lineWidth: 3
      })
      await this.getPieCate()
      pieChart.setOption({
        title: {
          text: '图书类型统计',
          subtext: '涉及领域',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.cateName
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
        series: [
          {
            name: '涉及领域',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      pieChart.hideLoading()
    }
  },
  created() {
    // this.getPieCate()
  },
  mounted() {
    this.getPieData()
  }
}
</script>
<style lang="less" scoped></style>
