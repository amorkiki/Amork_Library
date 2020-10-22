<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb
    separator-class="el-icon-arrow-right"
    active-text-color="#a38eaa"
  >
    <el-breadcrumb-item :to="{ path: '/home' }" active-text-color="#a38eaa"
      >home</el-breadcrumb-item
    >
    <el-breadcrumb-item
      ><slot name="pre">{{ pre }}</slot></el-breadcrumb-item
    >
    <el-breadcrumb-item
      ><slot name="cur">{{ cur }}</slot></el-breadcrumb-item
    >
  </el-breadcrumb>
</template>
<script>
export default {
  props: ['pre', 'cur']
}
</script>
