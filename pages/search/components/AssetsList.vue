<template>
  <div>
    <div class="assets-search-wrapper border-btm pb24 mb22">
      <div class="flex-width-min-to-max">
        <FilterCondition ref="filterCondition" :default-condition="defaultCondition"></FilterCondition>
      </div>
    </div>
    <div class="flex-width-min-to-max mb30 px-12">
      <div class="total-info mb30">
        <span class="tip ft16 mr6">共</span>
        <span class="num ft16 mr6">{{ total }}</span>
        <span class="tip ft16">个结果</span>
      </div>
      <empty-page v-if="!dataList.length" message="暂无数据" class="w-[100%] border-box" :is-action="false">
        <NuxtImg src="/images/search-empty.png"></NuxtImg>
      </empty-page>
      <template v-else>
        <div class="assets-list model-asset-list">
          <li class="asset-item" v-for="item in dataList" :key="item.id">
            <ProductCard :product-item="item" :right-type="priceType"></ProductCard>
          </li>
        </div>
        <div v-if="isLoading" class="loading-more">加载中...</div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const { isScrollToBottom } = usePagination()

const route = useRoute()
const keyword = ref<string>(route.query.searchContent as string)

const filterCondition = ref()
const isLoading = ref(false)
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)

const priceType = computed(() => filterCondition.value.filterValue.priceType)
const defaultCondition = ref({
  recommend: false,
  sortFieldType: 0,
  sortAsc: true,
  startPrice: null,
  endPrice: null,
  format: 0,
  surfaceCount: 0,
  other: []
})

const dataList = ref<Product.ProductItem[]>([])

const needLoadMore = computed(() => isScrollToBottom.value && dataList.value.length < total.value && !isLoading.value)

watch(needLoadMore, (newValue: boolean) => {
  if (newValue) {
    pageNo.value += 1
    keyword.value = (route.query.searchContent as string) || ""
    getAssetsListHandle()
    isScrollToBottom.value = false
  }
})

watch(
  [route, defaultCondition],
  () => {
    if (route.name !== "search") {
      return
    }
    pageNo.value = 1
    keyword.value = (route.query.searchContent as string) || ""
    dataList.value = []
    getAssetsListHandle()
  },
  {
    deep: true
  }
)

onMounted(() => {
  getAssetsListHandle()
})

const getAssetsListHandle = async () => {
  try {
    isLoading.value = true
    const params: Product.ReqSearchProduct = {
      pageNo: pageNo.value,
      pageSize,
      keyword: keyword.value,
      ...filterCondition.value.filterValue
    }
    if (params.sortPriceFieldType && params.sortFieldType === -1) {
      params.sortFieldType = params.sortPriceFieldType
      delete params.sortPriceFieldType
    }
    const data = await searchAssets(params)

    dataList.value = [...dataList.value, ...(data as any).list]
    total.value = (data as any).total

    isLoading.value = false
  } catch (err) {
    console.log("搜索报错", err)
    isLoading.value = false
  }
}
</script>
<style lang="scss" scoped>
.loading {
  width: 100%;
  line-height: 40px;
  text-align: center;
}
.search-content {
  width: 1410px;
  margin-right: auto;
  margin-left: auto;
}
.total-info {
  .tip {
    font-weight: 400;
    line-height: 22px;
    color: var(--el-color-info);
    letter-spacing: 0.16px;
  }
  .num {
    font-family: Inter;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    color: var(--el-text-color-regular);
  }
}
.assets-list {
  box-sizing: border-box;
  display: grid;
  grid-gap: 30px;
  width: 100%;
  margin: 0 auto;
  li {
    list-style: none;
  }

  // 1920-2040
  @media screen and (min-width: $screen-width-xlg) {
    grid-template-columns: repeat(6, 1fr);
    li {
      min-width: 299px;
      max-width: 357px;
    }
  }

  // ~-1200
  @media screen and (max-width: $screen-width-s) {
    grid-template-columns: repeat(4, 1fr);
    li {
      box-sizing: border-box;
      min-width: 252px;
      max-width: 357px;
    }
  }

  // 1200-1559
  @media screen and (min-width: $screen-width-s) and (max-width: $screen-width-lg) {
    grid-template-columns: repeat(4, 1fr);
    li {
      min-width: 252px;
      max-width: 357px;
    }
  }

  // 1560-1919
  @media screen and (min-width: $screen-width-lg) and (max-width: $screen-width-xlg) {
    grid-template-columns: repeat(5, 1fr);
    li {
      box-sizing: border-box;
      min-width: 266px;
      max-width: 354px;
    }
  }
}
</style>
