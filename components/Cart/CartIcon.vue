<template>
  <div class="cart-item">
    <el-link :underline="false">
      <icon-cart></icon-cart>
    </el-link>
    <el-badge :value="props.count" :max="99" :show-zero="false" class="cart-badge-item"></el-badge>
  </div>
</template>

<script setup lang="ts" name="CartIcon">
const props = defineProps({
  count: {
    type: Number,
    value: 0
  }
})
</script>
<style lang="scss" scoped>
.cart-item {
  position: relative;
  .cart-badge-item {
    position: absolute;
    top: -4px;
    right: -8px;
    font-size: var(--el-font-size-extra-small);
  }
}
</style>
