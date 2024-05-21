<template>
  <slot></slot>
</template>
<script setup lang="ts">
interface Props {
  // 是否有动画
  animate?: boolean
}
const { animate = false } = defineProps<Props>()

provide("animate", animate)
</script>
<style>
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
.skeleton-animate {
  background: linear-gradient(-45deg, #f1f2f3 25%, #ffffff 45%, #f1f2f3 65%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
}
</style>
