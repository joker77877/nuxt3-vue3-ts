<template>
  <div class="empty-500-container">
    <div class="img"><Image src="/images/500.png"></Image></div>
    <div class="empty-detail">
      <h2>{{ props.error?.statusCode }}</h2>
      <h3 class="title mt60 mb25">抱歉，服务器出了点小问题</h3>
      <a-button class="flex-items-center" type="text" @click="handleError">
        <icon-back class="base-icon mr10"></icon-back>
        返回首页
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: "/" })
</script>
<style lang="scss">
.empty-500-container {
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
