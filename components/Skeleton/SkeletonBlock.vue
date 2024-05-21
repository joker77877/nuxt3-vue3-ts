<template>
  <div
    class="rounded-[4px] bg-[#F1F2F3]"
    :class="{
      'skeleton-animate': animate
    }"></div>
</template>
<script setup lang="ts">
// 注入不含默认值的静态值
const animate = inject("animate")
</script>
