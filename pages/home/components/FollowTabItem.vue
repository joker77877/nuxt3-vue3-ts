<template>
  <!-- 关注 -->
  <div v-if="isLogin()" class="p-title-section-wrap product-section">
    <h2 class="title-2 pr50 pl50">来自你关注的人的内容</h2>
    <div class="boutique-content">
      <ul class="product-list model-asset-list">
        <template v-if="followPersonProductList.length > 0">
          <li class="asset-item" v-for="item in followPersonProductList" :key="item.id">
            <ProductCard :product-item="item"></ProductCard>
          </li>
        </template>
        <template v-else-if="followPersonLoading">
          <li class="asset-item" v-for="(_, i) in 10" :key="i">
            <product-card-skeleton></product-card-skeleton>
          </li>
        </template>
      </ul>
    </div>
  </div>
  <div class="p-title-section-wrap product-section">
    <h2 class="title-2 pr50 pl50">推荐关注的人</h2>
    <div class="boutique-content">
      <ul class="product-list focus-people model-asset-list">
        <template v-if="recommendDesigner.length > 0">
          <li class="asset-item" v-for="item in recommendDesigner" :key="item.id">
            <designer-card @change="handlerRefresh" :designer-item="item"></designer-card>
          </li>
        </template>
        <template v-else-if="recommendLoading">
          <li class="asset-item" v-for="(_, i) in 10" :key="i">
            <designer-card-skeleton></designer-card-skeleton>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data: followPersonProductList, loading: followPersonLoading } = useMyRequest(getAttentionProductList, {
  initialData: [],
  loadingDelay: 700,
  manual: !isLogin()
})
const { data: recommendDesigner, loading: recommendLoading } = useMyRequest(getRecommendDesignerList, {
  initialData: [],
  loadingDelay: 700
})
const handlerRefresh = async (id: number, value: boolean) => {
  const index = recommendDesigner.value.findIndex((item) => item.creatorId === id)
  if (index > -1) {
    recommendDesigner.value[index].designer = value
    if (value) {
      recommendDesigner.value[index].attentionCount += 1
    } else {
      recommendDesigner.value[index].attentionCount -= 1
    }
  }
}
</script>
<style lang="scss" scoped>
// 1920
@media screen and (min-width: $screen-width-xlg) {
  // 每行6个，最多2行
  .focus-people {
    .asset-item:nth-child(n + 13) {
      display: none;
    }
  }
}

// 1560-1919
@media screen and (min-width: $screen-width-lg) and (max-width: $screen-width-xlg) {
  // 每行5个，最多2行
  .focus-people {
    .asset-item:nth-child(n + 11) {
      display: none;
    }
  }
}

// 1200-1559
@media screen and (min-width: $screen-width-s) and (max-width: $screen-width-lg) {
  // 每行4个，最多3行
  .focus-people {
    .asset-item:nth-child(n + 13) {
      display: none;
    }
  }
}

// <1200
@media screen and (max-width: $screen-width-s) {
  // 每行4个，最多3行
  .focus-people {
    .asset-item:nth-child(n + 13) {
      display: none;
    }
  }
}
</style>
