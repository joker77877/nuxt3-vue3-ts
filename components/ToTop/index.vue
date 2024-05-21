<template>
  <icon-go-top @click="scrollToTopHandle" class="go-top-btn"></icon-go-top>
</template>
<script setup lang="ts">
const scrollToTopHandle = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
</script>
<style lang="scss" scoped>
.go-top-btn {
  position: fixed;
  right: 40px;
  bottom: 80px;
  z-index: 2;
  width: 48px !important;
  height: 48px !important;
  cursor: pointer;
  filter: drop-shadow(5px 5px 7px rgb(35 40 51 / 9%)) drop-shadow(22px 20px 12px rgb(35 40 51 / 2%));
}
</style>
