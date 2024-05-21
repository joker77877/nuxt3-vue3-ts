<template>
  <div class="product-section pb30">
    <ul class="product-list model-asset-list recommend">
      <template v-if="recommendList.length > 0">
        <li class="asset-item" v-for="item in recommendList" :key="item.id">
          <ProductCard :product-item="item"></ProductCard>
        </li>
      </template>
      <template v-else-if="recommendLoading">
        <li class="asset-item" v-for="(_, i) in 10" :key="i">
          <product-card-skeleton></product-card-skeleton>
        </li>
      </template>
    </ul>
    <div class="more-wrap pt30">
      <el-button @click="goAssetsList" round>查看更多 ></el-button>
    </div>
  </div>
  <div class="relative px-[50px] pb-[25px]">
    <nuxt-img class="w-full" src="/images/home-center-banner.jpg"></nuxt-img>
    <div class="absolute left-[8%] top-[58%] flex">
      <NuxtLink class="flex-justify-center" to="/upload">
        <div
          class="h-[44px] w-[132px] cursor-pointer justify-center rounded-[4px] bg-gradient-to-r from-[#A852FF] to-[#0029FF] font-medium text-white flex-items-center">
          上传您的3D作品
        </div>
      </NuxtLink>
      <div
        class="ml-10 h-[44px] w-[132px] cursor-pointer justify-center rounded-[4px] bg-white font-medium text-[#8149FF] flex-items-center">
        优质企业展示
      </div>
    </div>
  </div>
  <!-- 精品作品 -->
  <div class="p-title-section-wrap product-section">
    <h2 class="title-2 pr50 pl50">精品作品</h2>
    <div class="boutique-content">
      <ul class="product-list model-asset-list">
        <template v-if="boutiqueList.length > 0">
          <li class="asset-item" v-for="item in boutiqueList" :key="item.id">
            <ProductCard :product-item="item"></ProductCard>
          </li>
        </template>
        <template v-else-if="boutiqueLoading">
          <li class="asset-item" v-for="(_, i) in 10" :key="i">
            <product-card-skeleton></product-card-skeleton>
          </li>
        </template>
      </ul>
    </div>
    <div class="more-wrap pt30"><el-button @click="goAssetsList" round>查看更多 ></el-button></div>
  </div>
</template>
<script lang="ts" setup>
// 推荐作品
const { data: recommendList, loading: recommendLoading } = useMyRequest(getRecommendProductList, {
  initialData: [],
  loadingDelay: 700
})

// 精品作品
const { data: boutiqueList, loading: boutiqueLoading } = useMyRequest(getPremiumProductList, {
  initialData: [],
  loadingDelay: 700
})

const goAssetsList = () => {
  navigateTo("/asset")
}
</script>
<style lang="scss" scoped>
// 1920
@media screen and (min-width: $screen-width-xlg) {
  // 每行6个，最多4行
  .recommend {
    .asset-item:nth-child(n + 25) {
      display: none;
    }
  }

  // 每行6个，最多2行
  .boutique-content {
    .asset-item:nth-child(n + 13) {
      display: none;
    }
  }
}

// 1560-1919
@media screen and (min-width: $screen-width-lg) and (max-width: $screen-width-xlg) {
  .recommend {
    .asset-item:nth-child(n + 21) {
      display: none;
    }
  }

  // 每行5个，最多2行
  .boutique-content {
    .asset-item:nth-child(n + 11) {
      display: none;
    }
  }
}

// 1200-1559
@media screen and (min-width: $screen-width-s) and (max-width: $screen-width-lg) {
  .recommend {
    .asset-item:nth-child(n + 25) {
      display: none;
    }
  }

  // 每行4个，最多3行
  .boutique-content {
    .asset-item:nth-child(n + 13) {
      display: none;
    }
  }
}

// <1200
@media screen and (max-width: $screen-width-s) {
  .recommend {
    .asset-item:nth-child(n + 25) {
      display: none;
    }
  }

  // 每行4个，最多3行
  .boutique-content {
    .asset-item:nth-child(n + 13) {
      display: none;
    }
  }
}
</style>
