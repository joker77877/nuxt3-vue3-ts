<template>
  <div class="error-content flx-center flx-column">
    <div class="img-box mb18 flx-center">
      <img src="/images/to-be-published.png" v-if="isSelfOffShelf" alt="" />
      <img src="/images/to-be-published.png" v-else alt="" />
    </div>
    <p class="tips">{{ msg }}</p>
    <div class="btn-group mt40" v-if="isSelfOffShelf">
      <el-link href="/upload" :underline="false">
        <!-- TODO 跳转作品发布页面 -->
        <el-button type="primary" size="large">一键发布作品</el-button>
      </el-link>
      <el-button class="ml24" type="primary" size="large" @click="downloadHandle">立刻下载</el-button>
    </div>
    <div class="btn-group mt40" v-else>
      <el-link href="/asset" :underline="false">
        <el-button type="primary" size="large">去逛逛吧</el-button>
      </el-link>
    </div>
  </div>
  <Download v-if="showPopup" @close-download="showPopup = false" :product-id="productId" :order-id="orderId"></Download>
</template>
<script setup lang="ts">
const route = useRoute()
const { code } = route.query
const orderId = route.query.oId
const productId = Number(route.query.productId)

const showPopup = ref(false)
const isSelfOffShelf = ref(Number(code) === ProductCodeState.SELF_OFF_SHELF)
const msg = ref("")
onMounted(() => {
  switch (Number(code)) {
    case ProductCodeState.DRAFT:
      msg.value = "作品处于草稿状态"
      break
    case ProductCodeState.REVIEW:
      msg.value = "作品审核中"
      break
    case ProductCodeState.SELF_OFF_SHELF:
      msg.value = "您已购买了该作品版权，请一键发布作品"
      break
    case ProductCodeState.OFF_SHELF:
      msg.value = "作品已下架"
      break
    case ProductCodeState.NON_EXISTENT:
      msg.value = "作品不存在"
      break
    default:
      msg.value = "作品已下架"
  }
})
const downloadHandle = () => {
  showPopup.value = true
}
</script>
<style lang="scss" scoped>
.error-content {
  width: 100%;
  height: calc(100vh - 160px);
  .img-box {
    width: 260px;
    height: 260px;
    background: linear-gradient(0deg, rgb(204 204 204 / 20%) 0%, rgb(204 204 204 / 20%) 100%), #ffffff;
    border: 2px solid #f5f5f5;
    border-radius: 260px;
    img {
      display: block;
    }
  }
  .tips {
    font-size: var(--el-font-size-medium);
    font-weight: 400;
    line-height: 22px;
    color: var(--el-color-info);
  }
  .btn-group {
    .el-button {
      width: 200px;
      height: 48px;
    }
    .el-link {
      color: #ffffff;
    }
  }
}
</style>
