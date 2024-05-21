<template>
  <a-config-provider
    :theme="{
      components: {
        Table: {
          padding: 40,
          paddingContentVerticalLG: 24,
          controlItemBgHover: '#ffffff'
        },
        Button: {
          controlHeightLG: 48
        }
      }
    }">
    <div class="order-detail px-12 py-8 mita-bg-gray">
      <div class="mb-5 rounded-xl bg-white py-9 flex-col-items-center">
        <div class="mita-text-grey-nd">订单号：{{ detail?.no }}</div>
        <div class="py-6 text-2xl">{{ statusText }}</div>
        <template v-if="detail?.status === OrderTypeEnum.Completed">
          <icon-pay-success></icon-pay-success>
          <a-button
            type="primary"
            size="large"
            class="mt-6 w-[192px]"
            v-if="spuType !== AssetTypeEnum.LIMITED"
            @click="showPopup = true">
            立即下载
          </a-button>
        </template>
        <template v-else-if="detail?.status === OrderTypeEnum.UnPaid">
          <icon-wait></icon-wait>
          <NuxtLink :to="`/order/list?id=${detail?.id}&pid=${detail?.payOrderId}`" class="mt-6">
            <a-button type="primary" size="large" class="w-[192px]">立即付款</a-button>
          </NuxtLink>
          <div class="pt-3 font-medium text-[#EE6F2E]">
            <span>支付剩余时间</span>
            <span class="ml-3">{{ countDown }}</span>
          </div>
        </template>
        <template v-else-if="detail?.status === OrderTypeEnum.Canceled">
          <icon-transaction-close></icon-transaction-close>
          <div class="pb-[50px] pt-[22px]">订单超时未支付，交易失败</div>
        </template>
        <Download
          v-if="showPopup"
          @close-download="showPopup = false"
          :product-id="detail?.items[0].spuId || 0"
          :order-id="detail?.id"></Download>
      </div>
      <div class="rounded-xl bg-white px-10 py-6">
        <a-table
          :columns="columns"
          :data-source="detail?.items"
          class="rounded-xl border border-solid mita-border-color"
          :pagination="false">
          <template #bodyCell="{ record: row, column }">
            <template v-if="column.dataIndex === 'spuName'">
              <div class="font-medium flex-items-center">
                <Image
                  @click="onJumpDetail(row.spuId)"
                  :pic-url="row.picUrl"
                  class="mr-3 h-[120px] w-[136px] flex-shrink-0 cursor-pointer rounded-md"
                  alt="pic"></Image>
                <div class="flex-1 py-8 pr-2 mita-text-regular">
                  <a-tooltip :title="row.spuName" placement="top">
                    <p @click="onJumpDetail(row.spuId)" class="mb-4 w-fit max-w-[200px] cursor-pointer text-base text-hidden">
                      {{ row.spuName }}
                    </p>
                  </a-tooltip>
                  <a-tooltip :title="row.author" placement="top">
                    <p class="w-fit max-w-[200px] text-sm text-hidden">作者：{{ row.author }}</p>
                  </a-tooltip>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'originalPrice'">
              <div class="h-full py-8">
                <p class="mb-4 text-xl mita-text-red">￥{{ row.originalPrice }}</p>
                <a-tag v-if="spuType !== AssetTypeEnum.LIMITED">{{ RightTypeMap[row.rightType as RightType].label }}</a-tag>
                <a-tag v-else>限量资产</a-tag>
              </div>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <p class="h-full py-8 flex-items-center mita-text-regular">
                {{ statusText }}
              </p>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
const route = useRoute()

const columns = [
  {
    title: "作品信息",
    dataIndex: "spuName"
  },
  {
    title: "作品价格",
    dataIndex: "originalPrice"
  },
  {
    title: "数量",
    dataIndex: "count"
  },
  {
    title: "交易状态",
    dataIndex: "status"
  }
]
const countDown = ref("--:--:--")
const showPopup = ref(false)
const spuType = ref()
let timer: number
watch(
  () => route.query.t,
  (val) => {
    spuType.value = val ? Number(val) : ""
  },
  { immediate: true }
)
const { data: detail } = await useAsyncData(
  () =>
    getWorksOrderDetail({
      id: route.params.id as string
    }),
  {
    default: () => null
  }
)
const statusText = computed(() => OrderStatusEnum.VALUE_LABEL[detail.value?.status || 30])
onMounted(() => {
  if (detail.value?.status === OrderTypeEnum.UnPaid) {
    let duration = (detail.value?.payExpireTime || 0) - +new Date()
    countDown.value = getPaymentCountdown(duration)
    timer = window.setInterval(() => {
      duration -= 1000
      duration = duration < 0 ? 0 : duration
      if (!duration) {
        clearInterval(timer)
      }
      countDown.value = getPaymentCountdown(duration)
    }, 1000)
  }
})
onUnmounted(() => {
  clearInterval(timer)
})

const onJumpDetail = (id: number) => {
  if (spuType.value !== AssetTypeEnum.LIMITED) {
    navigateTo(`/asset/${id}`)
  } else {
    navigateTo(`/limit-asset/${id}`)
  }
}
</script>
<style lang="postcss" scoped>
.order-detail {
  :deep(.el-table .el-table__cell) {
    padding: 20px 0;
  }
  :deep(.el-table .cell) {
    @apply px-9 text-base font-normal mita-text-grey-nd;
  }
}
</style>
