<template>
  <div class="bussiness-dock-list">
    <a-spin :spinning="pending">
      <div class="bussiness-list w-full gap-7 grid xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6" v-if="data.list.length">
        <div v-for="e of data.list" :key="e.markName" @click="onJump(e.id)">
          <div class="h-[200px] w-full rounded-lg border border-solid border-[#EBEBED]">
            <Image :src="e.makerPicUrl" class="h-full w-full rounded-lg object-cover"></Image>
          </div>
          <p class="py-3 text-base">{{ e.markName }}</p>
        </div>
      </div>
      <empty-page v-else message="抱歉，我们未找到任何于此搜索相关的结果。" :is-action="false" class="pt-28">
        <NuxtImg src="/images/search-empty.png"></NuxtImg>
      </empty-page>
    </a-spin>
    <!-- <div
      v-bind="containerProps"
      @scroll="
        debounce((e) => {
          console.log(e.target?.scrollTop + e.target?.clientHeight, e.target.scrollHeight)
        }, 250)
      "
      class="max-h-[552px] overflow-auto">
      <div v-bind="wrapperProps" class="bussiness-list mt-10 flex flex-col gap-y-7">
        <div v-for="{ index, data: e } in list" :key="index" class="h-[248px]">
          <div class="flex justify-between">
            <div v-for="v of e" :key="v.id" class="w-[350px]" @click="onJump(v.id)">
              <div class="h-[200px] w-full rounded-lg border border-solid border-[#EBEBED]">
                <Image :src="v.makerPicUrl" class="h-full w-full rounded-lg object-cover"></Image>
              </div>
              <p class="py-3 text-base">{{ v.markName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <a-list class="mt-10" :grid="{ gutter: 28, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 4 }" :data-source="data">
          <template #renderItem="{ item: { name } }">
            <a-list-item>
              <div class="h-[200px] w-[350px] rounded-lg border border-solid border-[#EBEBED]"></div>
              <p class="mt-3">{{ name }}</p>
            </a-list-item>
          </template>
        </a-list>
        <div class="mt-10 flex flex-wrap gap-x-7 gap-y-10">
          <div v-for="e of data" :key="e.name">
            <div class="h-[200px] w-[350px] rounded-lg border border-solid border-[#EBEBED]"></div>
            <p class="mt-3">{{ e.name }}</p>
          </div>
        </div> -->
  </div>
</template>

<script setup lang="ts">
interface Props {
  setTotal: (v: number) => void
  recommend: boolean
  sortFieldType: number
  recentWorksNum: number
  areaIds?: number[]
  keyword?: string
  industryId?: number
}

const props = defineProps<Props>()
const { recommend, keyword, areaIds, sortFieldType, industryId } = toRefs(props)

const { data, pending, handlerScroll } = await useServerInfiniteScroll(
  (pageMap) =>
    useLazyAsyncData(
      () =>
        getMakerList({
          ...pageMap,
          keyword: keyword.value,
          sortFieldType: sortFieldType.value,
          recommend: recommend.value,
          areaIds: areaIds.value,
          industryIds: industryId.value ? [industryId.value] : undefined
        }),
      {
        default: () => ({ list: [], total: 0 }),
        transform: (e) => {
          let list: GetMakerList.Item[] = pageMap.pageNo > 1 ? [...data.value.list, ...e.list] : e.list
          props.setTotal(e.total)
          return {
            ...e,
            list
          }
        },
        server: false,
        watch: [props]
      }
    ),
  props,
  27
)

// const { data, pending, handlerScroll } = await useServerInfiniteScroll(
//   (pageMap) =>
//     useAsyncData(
//       "getMakerList",
//       () =>
//         getMakerList({
//           ...pageMap,
//           keyword,
//           sortFieldType,
//           recommend,
//           areaIds,
//           industryIds: industryId ? [industryId] : undefined
//         }),
//       {
//         default: () => ({ list: [], total: 0 }),
//         transform: (e) => {
//           const list: GetMakerList.Item[][] = []
//           const rows = Math.ceil(e.list.length / 3)

//           for (let i = 0; i < rows; i += 1) {
//             list.push(e.list.splice(0, 3))
//           }
//           dataSource.value.push(...dataSource.value, ...list, ...list, ...list)
//           return {
//             ...e,
//             list: dataSource.value
//           }
//         },
//         server: false,
//         watch: [pageMap, props]
//       }
//     ),
//   {
//     loadingDelay: 700
//   }
// )
// const { list, containerProps, wrapperProps } = useVirtualList<GetMakerList.Item[]>(data.value.list, {
//   itemHeight: 276,
//   overscan: 10
// })
const debounceFun = debounce(() => handlerScroll(data.value.list.length === data.value.total), 100)
onMounted(() => {
  document.addEventListener("scroll", debounceFun)
})
onUnmounted(() => {
  document.removeEventListener("scroll", debounceFun)
  clearNuxtData("getMakerList")
})
const onJump = (id: number) => {
  navigateTo(`${INDEX_ROUTE.BUSINESS_DOCK_DETAIL}/${id}`)
}
</script>
<style lang="postcss" scoped>
.bussiness-list {
  > div {
    cursor: pointer;
  }
}
</style>
