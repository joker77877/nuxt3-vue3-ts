<template>
  <div class="product-section">
    <ul class="product-list model-asset-list">
      <template v-if="data.length > 0">
        <li class="asset-item" v-for="item in data" :key="item.id"><product-card :product-item="item"></product-card></li>
      </template>
      <template v-else-if="loading">
        <li class="asset-item" v-for="(_, i) in 10" :key="i">
          <product-card-skeleton></product-card-skeleton>
        </li>
      </template>
      <Empty class="col-span-full" v-else></Empty>
    </ul>
    <a-spin class="mx-auto mt-10 block" tip="正在拼命加载中..." :spinning="loading && paging.pageNo > 1"></a-spin>
  </div>
</template>
<script setup lang="ts">
const { data, loading, paging } = useInfiniteScroll((page) => getTopUploadProductList(page), {
  loadingDelay: 700
})
</script>
