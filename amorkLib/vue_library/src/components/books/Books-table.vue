<template>
  <div>
      <el-table v-loading="loading" element-loading-text="努力加载中 >_<!!" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.4)" :data="tableData.slice((pagenum-1)*pagesize,pagenum*pagesize)" border style="width: 100%">
        <el-table-column type="index" width="30px"> </el-table-column>
        <el-table-column prop="type" label="Type" width="60px">
        </el-table-column>
        <el-table-column prop="b_name" label="Name"> </el-table-column>
        <el-table-column prop="author" label="Author"> </el-table-column>
        <el-table-column prop="publish" label="Publish"> </el-table-column>
        <el-table-column prop="isbn_num" label="ISBN" width="180px">
        </el-table-column>
        <el-table-column prop="pages" label="PAGES" width="80px">
        </el-table-column>
        <!-- 备注栏 -->
        <el-table-column label="Remark" width="85px"></el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="Control">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="edit"
              placement="top"
              :enterable="false"
            >
              <el-button type="text" @click="$emit('edit',scope.row._id)">
                <i
                  class="iconfont icon-customization"
                  style="color: #91ca8d"
                ></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="delete"
              placement="top"
              :enterable="false"
              ><el-button type="text" @click="$emit('remove',scope.row._id)">
                <i
                  class="iconfont icon-ashbin"
                  style="color: #ea7e53"
                ></i> </el-button
            ></el-tooltip>
            <el-tooltip
              effect="dark"
              content="skip to readingnotes"
              placement="top"
              :enterable="false"
              ><el-button type="text">
                <i
                  class="iconfont icon-attachment"
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