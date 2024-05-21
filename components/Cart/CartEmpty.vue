<template>
  <div class="cart-empty">
    <div class="empty-img"><el-image src="/images/cart-empty.png"></el-image></div>
    <div class="mt-[47px] text-[#A6A6A6]">您的购物车是空的~</div>
  </div>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped>
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  // height: calc(100vh - 500px);
  // max-height: 400px;
  min-height: 300px;
  .empty-img {
    width: 147px;
  }
}
</style>
