<template>
  <a-config-provider
    :theme="{
      token: {
        colorInfo: '#409EFF',
        colorError: '#F56C6C'
      }
    }">
    <div>
      <EditEnterpriseInfo
        :detail="makerDetail"
        v-if="makerDetail?.status !== MarkerStatusEnum.Success || editable"
        :refresh="refresh"></EditEnterpriseInfo>
      <ViewEnterpriseInfo v-else :detail="makerDetail" :refresh="refresh" v-model:editable="editable"></ViewEnterpriseInfo>
    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
const { refresh, data: makerDetail } = await useAsyncData(() => getMakerDetail(), { server: false })
const editable = ref(false)
</script>
<style lang="postcss" scoped>
/* .avatar-uploader {
  :deep(.ant-upload) {
    @apply h-[140px] w-[224px];
  }
} */
</style>
