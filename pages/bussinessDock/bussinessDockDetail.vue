<template>
  <div class="bussiness-dock-detail mx-12 pt-9">
    <div class="flex items-center justify-between border-b border-solid border-[#EBEBED] pb-6">
      <div class="w-2/3">
        <div class="text-3xl mb-5">{{ detail?.makerName }}</div>
        <a-row :gutter="[0, 4]" class="flex">
          <a-col :span="12">
            <span class="text-[#666]">所在城市：</span>
            <span>{{ detail?.areaName }}</span>
          </a-col>
          <a-col :span="12">
            <span class="text-[#666]">行业领域：</span>
            <span>{{ detail?.sectorTagName }}</span>
          </a-col>
          <a-col :span="12">
            <span class="text-[#666]">企业官网：</span>
            <NuxtLink :to="detail?.makerWebsite" class="text-blue" target="_blank">
              <span>{{ detail?.makerWebsite }}</span>
            </NuxtLink>
          </a-col>
          <a-col :span="12">
            <span class="text-[#666]">提供服务：</span>
            <span>{{ detail?.serviceTagNameList?.join("、") }}</span>
          </a-col>
        </a-row>
      </div>
      <div>
        <a-button size="large" class="w-[120px]">私信</a-button>
        <a-button class="ml-4 w-[120px]" size="large" type="primary" @click="onfollowOrCancelFollow">
          {{ isFollow ? "取消关注" : "关注" }}
        </a-button>
      </div>
    </div>
    <div class="mx-auto flex max-w-screen-2xl">
      <div class="pt-10 pb-20">
        <p class="mb-6 text-lg">企业简介</p>
        <div v-html="detail?.makerIntroduction"></div>
      </div>
      <div v-if="product.total" class="flex flex-col gap-y-7 border-l border-solid border-[#EBEBED] py-11 pl-12">
        <p class="text-lg">作品展示</p>
        <ProductCard v-for="e of product.list" :key="e.id" :product-item="e" :type="1"></ProductCard>
        <NuxtLink class="w-[330px] cursor-pointer flex-center mita-text-grey-nd">
          <span>查看更多</span>
          <IconMoreArrowRight></IconMoreArrowRight>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const page = reactive({
  pageNo: 1,
  pageSize: 5
})
const { checkIsLogin } = useCheckIsLogin()
const route = useRoute()
const { data: detail } = useRequest(() =>
  getMakerDetail({
    makerId: Number(route.params.id as string)
  })
)
const { data: isFollow, refresh } = useRequest(
  () =>
    getDesignerExits({
      designerId: detail.value?.userId || "0"
    }),
  {
    ready: () => Boolean(detail.value?.userId)
  }
)
const { data: product } = await useAsyncData(
  () =>
    getMakerProducts({
      ...page,
      makerId: Number(route.params.id as string)
    }),
  {
    default: (): GetMakerProducts.Result => ({ list: [], total: 0 }),
    server: false
  }
)
/**
 * @description: 关注/取消关注
 * @return {*}
 */
const onfollowOrCancelFollow = async () => {
  if (detail.value) {
    if (!checkIsLogin()) return
    if (isFollow.value) {
      await cancelFollowDesigner(detail.value.userId)
    } else {
      await followDesigner(detail.value.userId)
    }
    refresh()
  }
}
</script>
<style lang="postcss" scoped></style>
