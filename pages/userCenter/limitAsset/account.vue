<template>
  <result-frame>
    <p class="mb-8 text-[16px] font-medium">账户信息</p>
    <div class="mb-4 flex font-medium">
      <span class="flex-shrink-0">区块链地址&nbsp;:&nbsp;</span>
      <span>{{ account?.trainAddress || "--" }}</span>
    </div>
    <div class="mb-4 flex font-medium">
      <span class="flex-shrink-0">注册时间&nbsp;:&nbsp;</span>
      <span>{{ account?.registerTime || "--" }}</span>
    </div>
    <icon-result-divider class="my-8 w-full text-[#86DAFF]"></icon-result-divider>
    <p class="mb-8 text-[16px] font-medium">ta的藏品（{{ collectionList.length }}）</p>
    <div
      v-for="item in collectionList"
      :key="item.hashCode"
      class="mb-6 rounded-[10px] bg-[rgba(134,218,255,0.12)] px-6 pb-4 pt-8">
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">藏品名称&nbsp;:&nbsp;</span>
        <span class="flex-1">{{ item.name }}</span>
        <nuxt-link class="text-blue flex-items-center" :href="`/user-center/limit-asset/query/collection?hash=${item.hashCode}`">
          <span class="border-b border-solid border-blue">查看详情</span>
          <icon-arrow-right-full class="ml-2 h-5 w-5"></icon-arrow-right-full>
        </nuxt-link>
      </div>
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">收藏时间&nbsp;:&nbsp;</span>
        <span class="flex-1">{{ item.createTime }}</span>
      </div>
      <div class="mb-4 flex font-medium">
        <span class="flex-shrink-0">藏品哈希值&nbsp;:&nbsp;</span>
        <span class="flex-1">{{ item.hashCode }}</span>
      </div>
    </div>
  </result-frame>
</template>
<script setup lang="ts">
const {
  query: { hash = "" }
} = useRoute()

const { data: account } = useMyRequest(() =>
  queryBlackChainAccount({
    trainAddress: hash as string
  })
)

const paging = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})
const { data: collectionList } = useMyRequest(
  () =>
    queryBlackChainCollections({
      trainAddress: hash as string,
      pageNo: paging.pageNo,
      pageSize: paging.pageSize
    }).then(({ total, list }) => {
      paging.total = total
      return list
    }),
  {
    initialData: []
  }
)
</script>
