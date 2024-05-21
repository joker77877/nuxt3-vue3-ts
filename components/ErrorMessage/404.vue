<template>
  <div class="empty-404-container">
    <div class="img"><el-image src="/images/404.png"></el-image></div>
    <div class="empty-detail">
      <h3 class="title mt60 mb25">抱歉！您所访问的页面不存在</h3>
      <el-link type="primary" href="/" :underline="false">
        <icon-back class="base-icon mr10"></icon-back>
        返回首页
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts" name="EmptyPage404"></script>

<style scoped lang="scss">
.empty-404-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 155px);
  background: #ffffff;
  .empty-detail {
    text-align: center;
    .title {
      font-size: 24px;
    }
  }
}
</style>
