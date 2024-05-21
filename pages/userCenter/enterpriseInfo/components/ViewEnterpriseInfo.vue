<template>
  <div>
    <div class="mb-7 flex items-center justify-between">
      <div class="flex">
        <Image :pic-url="detail?.makerPicUrl" class="mr-7 h-40 w-[256px] mita-border"></Image>

        <div>
          <p class="mb-5 text-3xl">{{ detail?.makerName }}</p>
          <div class="flex flex-col gap-1 text-sm">
            <p>
              <span class="text-[#666]">所在城市：</span>
              <span>{{ detail?.areaName }}</span>
            </p>
            <p>
              <span class="text-[#666]">企业官网：</span>
              <NuxtLink :to="detail?.makerWebsite" target="_blank">{{ detail?.makerWebsite }}</NuxtLink>
            </p>
            <p>
              <span class="text-[#666]">行业领域：</span>
              <span>{{ detail?.sectorTagName }}</span>
            </p>
            <p>
              <span class="text-[#666]">提供服务：</span>
              <span>{{ detail?.serviceTagNameList?.join("、") }}</span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <a-button
          type="primary"
          class="w-[120px]"
          size="large"
          @click="editable = true"
          :disabled="!detail?.updateFlag && Number(restDays) > 0">
          编辑
        </a-button>
        <p class="mt-3 text-center text-[#999]" v-if="Number(restDays) > 0">{{ restDays }}天后可编辑</p>
      </div>
    </div>
    <div class="max-w-screen-2xl">
      <p class="mb-6 text-lg">企业简介</p>
      <div v-html="detail?.makerIntroduction"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ detail: MakerInfo | null }>()
const editable = defineModel<boolean>("editable")
const { detail } = toRefs(props)
const restDays = computed(() => dayjs.duration(+dayjs(detail.value?.countdownTime || 0).add(30, "day") - +new Date()).format("D"))
</script>
<style lang="postcss" scoped>
/* .avatar-uploader {
  :deep(.ant-upload) {
    @apply h-[140px] w-[224px];
  }
} */
</style>
