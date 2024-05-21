<template>
  <div class="order-success">
    <success-page class="fixed-width" message="支付成功" :is-action="true" :btn-message="btnMsg" @change="handler">
      <div class="img"><el-image src="/images/pay-success.png"></el-image></div>
    </success-page>
  </div>
  <Download v-if="showPopup" @close-download="showPopup = false" :product-id="productId" :order-id="orderId"></Download>
</template>

<script setup lang="ts">
const { checkIsLogin } = useCheckIsLogin()

const route = useRoute()

const showPopup = ref(false)
const productId = ref()
const orderId = ref()
const from = ref()
const btnMsg = computed(() => {
  return from.value && Number(from.value) === AssetTypeEnum.LIMITED ? "查看订单详情" : "立即下载"
})
const handler = () => {
  if (!checkIsLogin()) return
  // 如果是限量资产则直接去订单详情
  if (from.value && Number(from.value) === AssetTypeEnum.LIMITED) {
    navigateTo(`/order-detail/${orderId.value}`)
    return
  }
  if (productId.value) {
    showPopup.value = true
  } else {
    navigateTo(`/order-detail/${orderId.value}`)
  }
}
const init = () => {
  productId.value = route.query.id ?? Number(route.query.id)
  orderId.value = route.query.orderId
  from.value = route.query.from
  // if (!(productId.value && orderId.value)) {
  //   navigateTo("/404")
  // }
}
onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
.order-success {
  height: calc(100vh - 155px);
  padding: 40px;
  background-color: $bg-color-grey;
}
</style>
