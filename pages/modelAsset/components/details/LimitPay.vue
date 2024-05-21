<template>
  <div class="mb-8 rounded border border-solid border-[#EBEBED] px-[30px] py-[25px]">
    <p class="font-semibold leading-[38px] text-[32px]">
      <span v-if="detail.stock > 0" class="text-[#E54850]">￥{{ detail.price }}</span>
      <span v-else class="text-[#999]">已售罄</span>
    </p>
    <!-- 未购买 -->
    <a-button
      v-if="buyState === ProductStatus.NORMAL"
      :disabled="detail.stock === 0"
      :loading="loading"
      @click="handleCreateOrder"
      class="mt-5 h-[50px] flex-center"
      block
      type="primary">
      <icon-card class="mr-3 h-6 w-6"></icon-card>
      <span class="mr-2 text-[16px] font-medium">立即购买</span>
      <span v-if="detail.stock > 0" class="text-[12px]">（剩余{{ detail.stock }}份）</span>
    </a-button>
    <!-- 等待支付 -->
    <a-button @click="handlerPay" block type="primary" class="mt-5 h-[50px] flex-center" v-if="buyState === ProductStatus.PAYING">
      <icon-pay class="mr-3 h-6 w-6"></icon-pay>
      <span class="mr-2 text-[16px] font-medium">快去支付</span>
    </a-button>
    <a-divider class="mt-6 border-[#ccc]"></a-divider>
    <p class="mb-5 text-[18px] font-medium">购买须知</p>
    <p class="text-[16px]">
      数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有。用户不得将数字藏品用户任何商业用途因为区块链技术，本商品一经售出，不支持退换。
    </p>
  </div>
</template>
<script setup lang="ts">
interface Props {
  detail: Product.ProductDetail
}
const { detail } = defineProps<Props>()
const emit = defineEmits(["updateDetail"])

// 支付状态
const buyState = ref(ProductStatus.NORMAL)

// 获取订单状态
const { data: orderStatus } = useMyRequest(
  () =>
    getProductBuyState({
      spuId: detail.id,
      saleMode: 0,
      spuType: ProductSpuType.LIMIT
    }).then((res) => {
      buyState.value = res.state
      return res
    }),
  {
    manual: !isLogin()
  }
)

// 生成订单
const { run: handleCreateOrder, loading } = useMyRequest(
  () =>
    createOrder({
      items: [
        {
          spuId: detail.id,
          count: 1,
          rightType: 0,
          spuType: ProductSpuType.LIMIT
        }
      ]
    }).then((res) => {
      if (res.existInvalidSpu) {
        emit("updateDetail")
        message.warning("该藏品限额份数已卖完，请选择其他藏品")
      } else {
        navigateTo(`/limit-asset/order/list?id=${res.id}&pid=${res.payOrderId}`)
      }
    }),
  {
    manual: true
  }
)

// 去支付
const handlerPay = () => {
  if (orderStatus.value) {
    const { orderId, payId } = orderStatus.value
    navigateTo(`/limit-asset/order/list?id=${orderId}&pid=${payId}`)
  }
}
</script>
