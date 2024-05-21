<template>
  <div class="order-success">
    <empty-page message="抱歉，暂无搜索相关的结果。" :is-action="false" btn-message="立即下载" @change="handler">
      <div class="img"><el-image src="/images/search-empty.png"></el-image></div>
    </empty-page>
  </div>
</template>

<script setup lang="ts">
const handler = () => {
  console.log(66666)
}
</script>
<style lang="scss" scoped>
.order-success {
  height: 500px;
  padding: 40px;
  background-color: $bg-color-grey;
}
</style>
