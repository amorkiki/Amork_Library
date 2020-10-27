<template>
  <div>
    <el-table v-loading="loading" element-loading-text="正在努力加载中... >_<!!" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.2)" :data="tableData.slice((pagenum-1)*pagesize,pagenum*pagesize)" style="width: 100%" border stripe>
        <el-table-column type="index" width="35px"> </el-table-column>
        <el-table-column label="Creator" width="100px" prop="creator_name"></el-table-column>
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
                <i class="iconfont icon-unlock" style="color: #91ca8d" @click="$emit('edit',scope.row)"></i>
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
                  @click="$emit('delete',scope.row._id)"
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
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
  </div>
</template>

<script>
export default {
  props: ['tableData', 'loading', 'total'],
  data() {
    return {
      pagesize: 5,
      pagenum: 1
    }
  },
  methods: {
    // 监听 pagesize 改变 的事件
    handleSizeChange(newsize) {
      // console.log(newsize)
      this.pagesize = newsize
    },
    // 监听 页码值 改变 的事件
    handleCurrentChange(newpage) {
      // console.log(newpage)
      this.pagenum = newpage
    }
  }

}
</script>

<style>

</style>