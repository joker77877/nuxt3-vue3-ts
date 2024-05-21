<template>
  <div class="cart-product-item">
    <dl class="item-list sle">
      <dt class="img-wrap overflow-hidden rounded-[6px]" @click="goDetail">
        <Image class="block h-full" :pic-url="props.productItem.picUrl"></Image>
      </dt>
      <dd class="item-main">
        <span class="title title-3 sle" @click="goDetail">{{ props.productItem.spuName }}</span>
        <span class="author ftw500 pt10 sle">作者：{{ props.productItem.author }}</span>
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts" name="ProductItem">
interface OrderProductItemProps {
  productItem: Product.OrderProductInterface
}
const props = withDefaults(defineProps<OrderProductItemProps>(), {})
const goDetail = () => {
  // router.push(`/asset/${props.productItem.spuId}`)
  window.open(`/asset/${props.productItem.spuId}`, "_blank")
}
</script>
<style lang="scss" scoped>
.cart-product-item {
  width: 100%;
  .item-list {
    display: flex;
    dt.img-wrap {
      flex: 0 0 137px;
      height: 95px;
      border-radius: 6px;
    }
    .item-main {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      padding-left: 10px;
      .title,
      .author {
        display: inline-block;
        max-width: 250px;
      }
    }
  }
}
</style>
