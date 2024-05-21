<template>
  <full-carousel>
    <nuxt-img
      v-for="item in imgs"
      :key="item.path"
      @click="$router.push(item.path)"
      class="h-[414px] cursor-pointer object-cover"
      :src="item.picUrl"></nuxt-img>
  </full-carousel>
  <div class="flex-width-min-to-max">
    <div class="px-[50px] py-[40px]">
      <p class="pb-[40px] text-center text-xl leading-[22px]">甄选限量藏品</p>
      <div class="grid grid-cols-3 gap-[25px]">
        <template v-if="selectList.length > 0">
          <asset-item :product="item" limit-pos="lt" v-for="(item, i) in selectList" :key="i"></asset-item>
        </template>
        <template v-else-if="selectLoading">
          <asset-item-skeleton v-for="(_, i) in 3" :key="i"></asset-item-skeleton>
        </template>
        <empty-page v-else message="暂无数据" class="col-span-full pt-28" :is-action="false">
          <nuxt-img class="w-[150px]" src="/images/search-empty.png"></nuxt-img>
        </empty-page>
      </div>
      <div class="pt-10">
        <div class="flex items-center justify-between">
          <segmented v-model="rankType" @change="mutate([])" :options="FILTER_LIMIT_ASSET.RANK_TYPE.SELECT_OPTIONS"></segmented>
          <a-radio-group @change="mutate([])" v-model:value="timeType">
            <a-radio
              v-for="item in FILTER_LIMIT_ASSET.TIME_TYPE.SELECT_OPTIONS"
              class="ml-10"
              :key="item.label"
              :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </div>
        <div class="grid grid-cols-3 gap-[25px] pt-[34px]">
          <template v-if="rankList.length > 0">
            <asset-item :product="item" v-for="(item, i) in rankList" :key="i" :rank="i + 1"></asset-item>
          </template>
          <template v-else-if="rankLoading">
            <asset-item-skeleton v-for="(_, i) in 3" :key="i"></asset-item-skeleton>
          </template>
          <empty-page v-else message="暂无数据" class="col-span-full pt-28" :is-action="false">
            <nuxt-img class="w-[150px]" src="/images/search-empty.png"></nuxt-img>
          </empty-page>
        </div>
      </div>
    </div>
    <div class="tabs">
      <a-tabs v-model:value="listType" @change="handleTabChange">
        <a-tab-pane v-for="item in FILTER_LIMIT_ASSET.LIST_TYPE.SELECT_OPTIONS" :tab="item.label" :key="item.label"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="grid grid-cols-4 gap-[30px] px-[50px] pb-[60px] 2xl:grid-cols-5 4xl:grid-cols-6">
      <template v-if="assetList.length > 0">
        <asset-item :product="item" v-for="(item, index) in assetList" layout="compact" :key="index"></asset-item>
      </template>
      <template v-else-if="loading">
        <asset-item-skeleton v-for="(_, i) in 20" :key="i"></asset-item-skeleton>
      </template>
      <empty-page v-else message="暂无数据" class="col-span-full pt-28" :is-action="false">
        <nuxt-img class="w-[150px]" src="/images/search-empty.png"></nuxt-img>
      </empty-page>
      <a-spin class="col-span-full mt-[24px]" tip="正在拼命加载中..." :spinning="loading && paging.pageNo > 1"></a-spin>
    </div>
  </div>
</template>

<script setup lang="tsx">
const imgs = [
  {
    picUrl: "/images/home-top-banner-1.jpg",
    path: "/asset"
  },
  {
    picUrl: "/images/home-top-banner-2.jpg",
    path: "/designer"
  },
  {
    picUrl: "/images/home-top-banner-3.jpg",
    path: "/limit_asset"
  }
]

// 甄选资产
const { data: selectList, loading: selectLoading } = useMyRequest(
  () =>
    getLimitAssetSelect({
      pageNo: 1,
      pageSize: 3,
      position: AssetRecommendEnum.LIMIT
    }).then((res) => res || []),
  {
    initialData: [],
    loadingDelay: 700
  }
)
// 最多交易/查看资产
const rankType = ref(FILTER_LIMIT_ASSET.RANK_TYPE.DEAL)
const timeType = ref(FILTER_LIMIT_ASSET.TIME_TYPE.SEVEN_DAY)
const {
  data: rankList,
  loading: rankLoading,
  mutate
} = useMyRequest(
  () =>
    getLimitAssetRank({
      type: rankType.value,
      recentTime: timeType.value,
      pageNo: 1,
      pageSize: 3
    }).then((res) => res || []),
  {
    initialData: [],
    loadingDelay: 700,
    refreshDeps: [rankType, timeType]
  }
)
// 滚动加载列表
const listType = ref(FILTER_LIMIT_ASSET.LIST_TYPE.SELECT_OPTIONS[0].value)

const {
  data: assetList,
  loading,
  run: loadData,
  reset,
  paging
} = useInfiniteScroll(
  ({ pageNo, pageSize }) =>
    getLimitAssetList({
      pageNo,
      pageSize,
      type: listType.value,
      spuType: 2
    }),
  {
    loadingDelay: 700,
    pageSize: 40
  }
)

const handleTabChange = () => {
  reset()
  loadData()
}
</script>
<style lang="scss" scoped>
.tabs {
  :deep(.ant-tabs-nav) {
    justify-content: center;
    margin-bottom: 40px;
    .ant-tabs-nav-wrap {
      flex: 0 0 auto;
    }
    .ant-tabs-tab {
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      color: #797979;
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #232833;
      }
    }
    .ant-tabs-tab + .ant-tabs-tab {
      margin-left: 50px;
    }
    .ant-tabs-ink-bar {
      background: #232833;
    }
  }
}
</style>
