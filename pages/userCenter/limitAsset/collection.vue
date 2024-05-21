<template>
  <result-frame>
    <template v-if="detail">
      <p class="mb-8 text-[16px] font-medium">藏品信息</p>
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">藏品名称&nbsp;:&nbsp;</span>
        <span>{{ detail.collectionInfo.name }}</span>
      </div>
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">藏品哈希值&nbsp;:&nbsp;</span>
        <span>{{ detail.collectionInfo.hashCode }}</span>
      </div>
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">创作者&nbsp;:&nbsp;</span>
        <span>{{ detail.collectionInfo.createUserName }}</span>
      </div>
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">发行方&nbsp;:&nbsp;</span>
        <span>{{ detail.collectionInfo.publisher }}</span>
      </div>
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">作品介绍&nbsp;:&nbsp;</span>
        <nuxt-link :href="`/limit-asset/${detail.collectionInfo.spuId}`" target="_blank" rel="noopener noreferrer">
          前往详情
        </nuxt-link>
      </div>
      <icon-result-divider class="my-8 w-full text-[#86DAFF]"></icon-result-divider>
      <p class="mb-8 text-[16px] font-medium">流转信息</p>
      <div class="pb-4">
        <div class="mb-4 flex font-medium">
          <span class="flex-shrink-0">来源地址&nbsp;:&nbsp;</span>
          <span>{{ detail.transferInfo.fromTrainAddress }}</span>
        </div>
        <div class="mb-4 flex font-medium">
          <span class="flex-shrink-0">目标地址&nbsp;:&nbsp;</span>
          <span>{{ detail.transferInfo.toTrainAddress }}</span>
        </div>
        <div class="mb-4 flex font-medium">
          <span class="flex-shrink-0">流转类型&nbsp;:&nbsp;</span>
          <span>{{ TransferType[detail.transferInfo.transferType] }}</span>
        </div>
        <div class="mb-4 flex font-medium">
          <span class="flex-shrink-0">流转时间&nbsp;:&nbsp;</span>
          <span>{{ detail.transferInfo.createTime }}</span>
        </div>
      </div>
    </template>
  </result-frame>
</template>
<script setup lang="ts">
const {
  query: { hashCode = "" }
} = useRoute()

const { data: detail } = useMyRequest(() =>
  queryCollectionDetail({
    hashCode: hashCode as string
  })
)
</script>
<style lang="scss" scoped></style>
