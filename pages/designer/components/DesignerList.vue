<template>
  <div class="designer-list w-full" v-if="designerList.length">
    <DesignerItem
      :class="props.sizeClass"
      v-for="designerItem in designerList"
      :key="designerItem.id"
      :designer="designerItem"></DesignerItem>
  </div>
  <div v-else-if="isLoading" class="is-loading">加载中...</div>
  <empty-page v-else message="抱歉，我们未找到任何于此搜索相关的结果。" :is-action="false" class="pt-28">
    <NuxtImg src="/images/search-empty.png"></NuxtImg>
  </empty-page>
</template>
<script setup lang="ts">
const { isScrollToBottom } = usePagination()

interface Props {
  setTotal?: (v: number) => void
  recommend: boolean
  sortFieldType: number
  recentWorksNum: number
  areaIds?: number[]
  keyword?: string
  industryId?: number
  sizeClass?: string
}

const props = defineProps<Props>()

const designerList = ref<Designer.SearchDesignerItem[]>([])

const isLoading = ref(true)
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)

const needLoadMore = computed(
  () => isScrollToBottom.value && designerList.value && designerList.value.length < total.value && !isLoading.value
)

const getDesignerListHandle = async () => {
  try {
    isLoading.value = true
    const areaIds = props.areaIds ? props.areaIds.at(-1) : null
    const params: Designer.ReqSearchDesigner = {
      pageNo: pageNo.value,
      pageSize,
      recommend: props.recommend,
      sortFieldType: props.sortFieldType,
      recentWorksNum: props.recentWorksNum
    }
    if (areaIds) {
      params.areaIds = areaIds
    }
    if (props.keyword) {
      params.keyword = props.keyword
    }
    if (props.industryId) {
      params.industryIds = props.industryId
    }
    const data = await searchDesigner(params)
    designerList.value = [...designerList.value, ...(data as any).list]
    if (props.setTotal) {
      props.setTotal(data.total)
    }
    total.value = (data as any).total
    isLoading.value = false
  } catch (err) {
    console.log("搜索报错", err)
    isLoading.value = false
  }
}

onMounted(() => {
  getDesignerListHandle()
})

watch(
  () => props,
  () => {
    designerList.value = []
    pageNo.value = 1
    getDesignerListHandle()
    isScrollToBottom.value = false
  },
  {
    deep: true
  }
)

watch(needLoadMore, (newValue: boolean) => {
  if (newValue) {
    pageNo.value += 1
    getDesignerListHandle()
    isScrollToBottom.value = false
  }
})
</script>
<style lang="scss" scoped>
.designer-item {
  &:not(:last-child) {
    margin-bottom: 30px;
    border-bottom: 1px solid #ebebed;
  }
}
</style>
