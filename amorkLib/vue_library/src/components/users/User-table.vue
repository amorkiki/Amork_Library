<template>
  <el-row>
    <!-- 用户列表区域 -->
    <el-table v-loading="loading" element-loading-text="努力加载中 >_<!!" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)" :data="tableData.slice((pagenum-1)*pagesize,pagenum*pagesize)" :row-class-name="tableRowClassName">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="name" label="NAME"> </el-table-column>
        <el-table-column prop="email" label="EMAIL"> </el-table-column>
        <el-table-column prop="identity" label="IDENTITY"> </el-table-column>
        <!-- 状态栏 -->
        <el-table-column label="STATUS">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.situation"
              @change="$emit('switch',scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="CONTROL">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="edit"
              placement="top"
              :enterable="false"
            >
              <el-button type="text" @click="$emit('edit',scope.row._id)">
                <i class="iconfont icon-editor" style="color: #91ca8d"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="delete"
              placement="top"
              :enterable="false"
            >
              <el-button type="text" @click="$emit('remove',scope.row._id)">
                <i
                  class="iconfont icon-ashbin"
                  style="color: #ea7e53"
                ></i> </el-button
            ></el-tooltip>
            <el-tooltip
              effect="dark"
              content="skip to booklist"
              placement="top"
              :enterable="false"
              ><el-button type="text" @click="$emit('skip',scope.row)">
                <i
                  class="iconfont icon-Moneymanagement"
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
  </el-row>
</template>

<script>
export default {
  props: ['tableData', 'total', 'loading'],
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
    },
    // 表格状态颜色
    tableRowClassName({ row }) {
      // console.log(row.situation)
      if (row.situation === true) {
        return 'success-row'
      } else if (row.situation === false) {
        return 'warning-row'
      }
      return ''
    }
  }

}
</script>

<style>

</style>