<template>
  <div class="user-order w-full">
    <div>
      <a-tabs v-model:activeKey="activeKey" class="user-order__tabs" @change="onChangeTab">
        <a-tab-pane v-for="e of USER_ORDER_TABS" :key="e.name" :tab="e.label"></a-tab-pane>
      </a-tabs>
      <div class="mt-8" v-loading="pending">
        <a-row class="mita-text-grey-nd px-5 text-base">
          <a-col :span="9">作品信息</a-col>
          <a-col :span="3">作品价格</a-col>
          <a-col :span="3">交易状态</a-col>
          <a-col :span="2">实付款</a-col>
          <a-col :span="7" class="pl-4">操作</a-col>
        </a-row>
        <div class="user-order__item flex" v-for="e of data?.list" :key="e.id">
          <a-card class="w-full">
            <template #title>
              <div class="mita-text-grey-nd leading-5">
                <span>{{ dayjs(e.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
                <span class="ml-3">订单号：{{ e.no }}</span>
              </div>
            </template>
            <template v-if="e.items.length < 2">
              <a-row class="mita-text-grey-nd text-base" v-for="v of e.items" :key="v.id">
                <orderItem :e="e" :v="v"></orderItem>
                <a-col :span="7" class="pl-4">
                  <div class="h-full flex-col-justify-center">
                    <div class="gap-3 flex-items-center">
                      <NuxtLink v-if="e.status === OrderTypeEnum.UnPaid" @click="onJumpOrderPay(e?.id, e?.payOrderId, v.spuType)">
                        <a-button ghost type="primary" size="large" class="w-[120px]">立即付款</a-button>
                      </NuxtLink>
                      <a-button
                        @click="handleDownload(e.id)"
                        ghost
                        type="primary"
                        size="large"
                        class="w-[120px]"
                        v-else-if="e.status === OrderTypeEnum.Completed && v.spuType !== AssetTypeEnum.LIMITED">
                        立即下载
                      </a-button>
                      <NuxtLink :to="`/order-detail/${e.id}?t=${v.spuType}`">
                        <a-button ghost type="primary" size="large" class="w-[120px]">订单详情</a-button>
                      </NuxtLink>
                    </div>
                    <NuxtLink
                      v-if="v.rightType === RightTypeEnum.Copyright && e.status === OrderTypeEnum.Completed && v.ownerProduct"
                      :to="`/works/${v.spuId}`"
                      class="mt-3 w-[120px] text-center text-sm text-[#649AF7]">
                      一键发布作品
                    </NuxtLink>
                  </div>
                </a-col>
              </a-row>
            </template>
            <template v-else>
              <div class="relative">
                <a-row v-for="(v, i) of e.items" :key="v.id" class="mita-text-grey-nd text-base">
                  <orderItem :e="e" :v="v"></orderItem>
                  <a-divider v-if="i < e.items.length - 1" style="width: 70.83%"></a-divider>
                </a-row>
                <div class="mita-border-color absolute right-5 top-0 h-full w-[calc(29.17%-10px)] border-l border-solid pl-4">
                  <div class="h-full py-8 flex-col-justify-center">
                    <div class="gap-3 flex-items-center">
                      <NuxtLink
                        v-if="e.status === OrderTypeEnum.UnPaid"
                        @click="onJumpOrderPay(e?.id, e?.payOrderId, e.items[0].spuType)">
                        <a-button ghost type="primary" size="large" class="w-[120px]">立即付款</a-button>
                      </NuxtLink>
                      <a-button
                        ghost
                        type="primary"
                        size="large"
                        class="w-[120px]"
                        @click="handleDownload(e.id)"
                        v-else-if="e.status === OrderTypeEnum.Completed && e.items[0].spuType !== AssetTypeEnum.LIMITED">
                        立即下载
                      </a-button>
                      <NuxtLink :to="`/order-detail/${e.id}?t=${e.items[0].spuType}`">
                        <a-button ghost type="primary" size="large" class="w-[120px]">订单详情</a-button>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </a-card>
        </div>
        <empty-page v-if="data?.list.length === 0" description="暂无数据" :is-action="false" class="pt-40">
          <NuxtImg src="/images/search-empty.png"></NuxtImg>
        </empty-page>
      </div>
    </div>
    <a-pagination
      v-if="data?.list.length"
      show-size-changer
      show-quick-jumper
      class="mt-14 flex justify-center"
      v-model:current="pageNo"
      v-model:page-size="pageSize"
      :total="data.total"></a-pagination>
    <Download v-if="showPopup" @close-download="showPopup = false" :order-id="orderId"></Download>
  </div>
</template>
<script setup lang="ts">
const activeKey = ref(-1)
const pageNo = ref(1)
const pageSize = ref(10)
const showPopup = ref(false)
const orderId = ref<number>()
const handleDownload = (v: number) => {
  orderId.value = v
  showPopup.value = true
}

const { data, refresh, pending } = await useAsyncData(
  () =>
    getOrderList({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: activeKey.value < 0 ? undefined : activeKey.value
    }),
  {
    default: () => ({ list: [], total: 0 }),
    server: false,
    watch: [pageNo, pageSize, activeKey]
  }
)
const onChangeTab = () => {
  refresh()
}
const onJumpOrderPay = (id: number, pid: number, type: number) => {
  if (type !== AssetTypeEnum.LIMITED) {
    navigateTo(`/order/list?id=${id}&pid=${pid}`)
  } else {
    navigateTo(`/limit-asset/order/list?id=${id}&pid=${pid}`)
  }
}
</script>
<style lang="scss" scoped>
.user-order {
  .user-order__item {
    margin-top: 36px;
  }
}
</style>
