<template>
  <div
    class="rounded-[4px] bg-[#F1F2F3] after:block after:w-[1px] after:overflow-hidden after:text-[rgba(0,0,0,0)] after:content-['高']"
    :style="{
      width: `${w}%`
    }"
    :class="{
      'skeleton-animate': animate
    }"></div>
</template>
<script setup lang="ts">
interface Props {
  // 百分比宽度
  w?: number | string
}

const { w = 33 } = defineProps<Props>()
const animate = inject("animate")
</script>
