<template>
  <div>
    <p class="text-lg">企业信息</p>
    <a-config-provider
      :theme="{
        token: {
          colorInfo: '#409EFF',
          colorError: '#F56C6C'
        }
      }">
      <a-alert
        class="mt-2 text-[#409EFF]"
        banner
        message="预计在 1~2 个工作日内完成审核。通过审核后，在商业对接列表可以搜索到您的企业"
        type="info"
        show-icon
        v-if="makerDetail?.status === MarkerStatusEnum.Apply"></a-alert>
      <a-alert
        class="mt-2 text-[#F56C6C]"
        banner
        message="审核不通过，请修改后重新提交。"
        type="error"
        show-icon
        v-else-if="makerDetail?.status === MarkerStatusEnum.Refuse"></a-alert>
    </a-config-provider>

    <!-- <EditEnterpriseInfo :detail="makerDetail" v-if="makerDetail?.status !== MarkerStatusEnum.Success"></EditEnterpriseInfo> -->
    <div>
      <div class="mb-7 flex items-center justify-between">
        <div class="flex">
          <Image :pic-url="makerDetail?.makerPicUrl" class="mr-7 h-40 w-[256px]"></Image>

          <div>
            <p class="mb-5 text-3xl">{{ makerDetail?.makerName }}</p>
            <div class="flex flex-col gap-1 text-sm">
              <p>
                <span class="text-[#666]">所在城市：</span>
                <span>{{ makerDetail?.areaName }}</span>
              </p>
              <p>
                <span class="text-[#666]">企业官网：</span>
                <span>{{ makerDetail?.makerWebsite }}</span>
              </p>
              <p>
                <span class="text-[#666]">行业领域：</span>
                <span>{{ makerDetail?.sectorTagName }}</span>
              </p>
              <p>
                <span class="text-[#666]">提供服务：</span>
                <span>{{ makerDetail?.serviceTagNameList?.join("、") }}</span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <a-button type="primary" class="w-[120px]" size="large" :disabled="!makerDetail?.updateFlag">编辑</a-button>
          <p class="text-[#999]" v-if="Number(restDays) > 0">{{ restDays }}天后可编辑</p>
        </div>
      </div>
      <div v-html="makerDetail?.makerIntroduction"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { pending, data: makerDetail } = await useAsyncData(() => getMakerDetail(), { server: false })
const restDays = computed(() =>
  dayjs.duration(+dayjs(makerDetail.value?.createTime || 0).add(30, "day") - +new Date()).format("D")
)
</script>
<style lang="postcss" scoped>
/* .avatar-uploader {
  :deep(.ant-upload) {
    @apply h-[140px] w-[224px];
  }
} */
</style>

