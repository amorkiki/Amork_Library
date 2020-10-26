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
      cateName: []
    }
  },
  methods: {
    async getPieCate() {
      var arr = []
      var obj1 = {}
      var arr3 = []
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
      console.log(arr)
      // 每个type出现的次数 {'前端':8,'考试':1, ...}
      this.pieCate = arr.reduce((obj, name) => {
        if (name in obj) {
          obj[name]++
        } else {
          obj[name] = 1
        }
        return obj
      }, {})
      console.log(this.pieCate)
      // type组成的数组['前端', '物理', '小说', '考试', '外文']
      for (const key in this.pieCate) {
        this.cateName.push(key) 
      }
      console.log(this.cateName)
      // 循环得出type的name和次数value
      for (let i = 0; i < this.cateName.length; i++) {
        obj1.name = this.cateName[i]
        console.log(obj1)
        arr3[i] = obj1
        console.log(arr3)
      }
    }
  },
  created() {
    this.getPieCate()
  },
  mounted() {
    ;(function() {
      var pieChart = echarts.init(document.getElementById('pie'))
      pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['前端', '物理', '小说', '考试', '外文']
        },
        series: [
          {
            name: '涉及领域',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 8, name: '理工', selected: true },
              { value: 1, name: '文艺' },
              { value: 1, name: '考试' },
              { value: 2, name: '外文' }
            ]
          },
          {
            name: '涉及领域',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            data: [
              { value: 6, name: '前端' },
              { value: 2, name: '物理' },
              { value: 1, name: '小说' },
              { value: 1, name: '考试' },
              { value: 2, name: '外文' }
                
            ]
          }
        ]
      })
    })()
  }
}
</script>
<style lang="less" scoped></style>
