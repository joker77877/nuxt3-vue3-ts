<template>
  <div class="mb-8 leading-[22px] pt-10 pb-3 px-[30px] rounded border border-solid border-[#EBEBED]" v-if="orderList.length">
    <div class="font-medium text-[18px] mb-2">最近交易记录</div>
    <div class="flex justify-between pb-6 font-medium text-[18px] border-b-[#EBEBED] border-b border-solid mb-6 leading-[44px]">
      <span class="text-[16px] text-[#666]">{{ spuType === ProductSpuType.ASSET ? "作品累计收益" : "单限量资产累计收益" }}</span>
      <span class="text-[32px] text-blue font-medium">￥{{ totalPrice }}</span>
    </div>
    <div
      class="grid mb-5 text-[12px] leading-[30px]"
      :class="[spuType === ProductSpuType.ASSET ? 'grid-cols-4' : 'grid-cols-3']"
      v-for="order in orderList"
      :key="order.id">
      <div class="flex">
        <Image class="w-[30px] h-[30px] mr-2 rounded-full" :is-avatar="true" :pic-url="order.userAvatar"></Image>
        <span class="flex-1 truncate">{{ order.userNickname }}</span>
      </div>
      <span class="text-[#666]" :class="[spuType === ProductSpuType.ASSET ? 'text-right' : 'text-center']">{{ order.time }}</span>
      <span v-if="spuType === ProductSpuType.ASSET" class="text-[#666] text-right">{{ order.copyrightType }}</span>
      <span class="font-medium text-right">￥ {{ order.payPrice }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatDate } from "@/utils/utils.func"

interface OrderItem {
  createTime: number
  id: number
  payPrice: number
  rightType: number
  time?: string
  copyrightType?: string
  userAvatar: string
  userId: number
  userNickname: string
}
interface Props {
  productId: string
  spuType: number
}

const COPYRIGHT_TYPES = ["个人授权", "企业授权", "版权已售出"]

const { productId, spuType } = defineProps<Props>()

const totalPrice = ref()
const orderList = ref<OrderItem[]>([])

const getOrderListHandle = async () => {
  try {
    const data = await getProductOrderList(productId)

    totalPrice.value = data.totalPrice
    orderList.value =
      data.tradeProductOrderRespList?.map((item) => {
        item.time = formatDate(item.createTime)
        item.copyrightType = COPYRIGHT_TYPES[item.rightType - 1]
        return item
      }) || []
  } catch (err) {
    console.log("获取getOrderListHandle报错", err)
  }
}

onMounted(() => {
  getOrderListHandle()
})
</script>
