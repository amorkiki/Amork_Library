<template>
  <div>      
    <el-table v-loading="loading" element-loading-text="正在努力加载中... >_<!!" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.2)" :data="tableData.slice((pagenum-1)*pagesize,pagenum*pagesize)" border style="width: 100%">
        <el-table-column type="index" width="40px" label="序列">
        </el-table-column>
        <el-table-column prop="type" label="Type" width="60px">
        </el-table-column>
        <el-table-column prop="b_name" label="Name"> </el-table-column>
        <el-table-column prop=" pages" label="Total Pages" width="120px">
          <template slot-scope="scope">
            <!-- 总页数标签 -->
            <el-tag type="info" size="medium">
              {{ scope.row.pages }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 进度条栏 -->
        <el-table-column label="Progress">
          <template slot-scope="scope">
            <el-progress
              :percentage="scope.row.progress"
              :color="color"
              :stroke-width="12"
              text-inside
            ></el-progress>
          </template>
        </el-table-column>
        <!-- 明细栏 -->
        <el-table-column label="Show Details" width="220px">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              content="update current prgress"
              placement="top"
              :enterable="false"
            >
              <el-button type="text" @click="$emit('change',scope.row._id)"
                ><i
                  class="iconfont icon-exchangerate"
                  style="color: #91ca8d; font-size: 25px"
                ></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="add new logs"
              placement="top"
              :enterable="false"
            >
              <el-button type="text" @click="$emit('add',scope.row)"
                ><i class="iconfont icon-writing" style="color: #7288ac"></i
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="show logs"
              placement="top"
              :enterable="false"
            >
              <el-button type="text" @click="$emit('show',scope.row.b_name)"
                ><i class="iconfont icon-contacts" style="color: #ea7e53"></i
              ></el-button>
            </el-tooltip>
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
  props: ['tableData', 'loading', 'total', 'color'],
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