<template>
  <el-row :gutter="25">
    <el-col :span="12">
      <el-input
        placeholder="请先勾选查找方式..."
        v-model="queryInfo.query"
        clearable
        @clear="getBookList()"
      >
        <el-select v-model="selected" slot="prepend" placeholder="查找方式">
          <el-option label="书名" value="1"></el-option>
          <el-option label="作者" value="2"></el-option>
          <el-option label="类型" value="3"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findBookList(selected)"
        ></el-button>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="info" @click="addDialogVisible = true">ADD</el-button>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    label: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    inModel: {
      type: Array
    },
    sModel: {
      type: Number
    }
  }
}
</script>
