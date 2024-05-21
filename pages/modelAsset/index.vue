<template>
  <div class="asset-index-container">
    <nuxt-img class="block w-full" src="/images/asset-index-banner@2px.png"></nuxt-img>
    <div class="main-wrap fixed-width-min-to-max">
      <filter-type ref="categoryFilterRef" :default-value="filterTypeValue" @change="handlerChange"></filter-type>
      <filter-condition ref="filterRef" :default-condition="filterValue" @change="handlerChange"></filter-condition>
      <div class="normal-product-list">
        <ul class="model-asset-list">
          <template v-if="resultData.length > 0">
            <li class="asset-item" v-for="item in resultData" :key="item.id">
              <product-card :product-item="item" :right-type="rightType"></product-card>
            </li>
          </template>
          <template v-else-if="loading">
            <li class="asset-item" v-for="(_, i) in 10" :key="i">
              <product-card-skeleton></product-card-skeleton>
            </li>
          </template>
          <Empty class="col-span-full" v-else></Empty>
        </ul>
        <a-spin class="mx-auto mt-[24px] block" tip="正在拼命加载中..." :spinning="loading && page.pageNo > 1"></a-spin>
      </div>
    </div>
    <el-backtop :right="100" :bottom="100"></el-backtop>
  </div>
</template>

<script setup lang="ts">
import FilterCondition from "./components/index/FilterCondition.vue"
import FilterType from "./components/index/FilterType.vue"
// 刷选排序条件
const filterValue = reactive<FilterConditionInterface>({
  recommend: false,
  sortFieldType: 0,
  sortAsc: true,
  startPrice: null,
  endPrice: null,
  format: 0,
  surfaceCount: 0,
  other: []
})
// 筛选类别
const filterTypeValue = reactive<FilterTypeInterface>({
  categoryIds: undefined,
  subCategoryIds: undefined
})
const filterRef = ref<InstanceType<typeof FilterCondition> | null>(null)
const categoryFilterRef = ref<InstanceType<typeof FilterType> | null>(null)
const page = reactive({
  pageSize: 20,
  pageNo: 1,
  total: 0
})
const rightType = ref<number | undefined>()

const {
  data: resultData,
  error: err,
  loading,
  run: loadData,
  mutate
} = useMyRequest(
  (isScroll = false) =>
    get3DAssertListByFilters({
      ...page,
      categoryIds: categoryFilterRef.value?.id,
      subCategoryIds: categoryFilterRef.value?.subId,
      ...filterRef.value?.price,
      ...filterRef.value?.filterValue
    }).then(({ list, total }) => {
      page.total = total
      const res: Array<Product.ProductItem> = isScroll ? [...resultData.value, ...list] : list
      return res
    }),
  {
    initialData: [],
    loadingDelay: 700,
    manual: true
  }
)

// 提示条件改变，需要更新数据
const handlerChange = () => {
  rightType.value = filterRef.value?.price.type
  page.pageNo = 1
  mutate([])
  loadData()
}

const handlerScroll = () => {
  if (loading.value || err.value || page.total === resultData.value.length) return
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight

  // 根据distanceToBottom的值判断用户是否接近底部
  if (scrollTop + windowHeight >= scrollHeight - 300) {
    page.pageNo += 1
    loadData(true)
  }
}
const debounceLoad = debounce(handlerScroll)
onMounted(() => {
  loadData()
  document.addEventListener("scroll", debounceLoad)
})

onUnmounted(() => {
  document.removeEventListener("scroll", debounceLoad)
})
</script>
<style lang="scss" scoped>
.asset-index-container {
  .main-wrap {
    padding: 18px 0;
    margin: 0 auto;
  }
  .normal-product-list {
    padding: 15px 50px 0;
  }
}
</style>
