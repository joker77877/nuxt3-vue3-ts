<template>
  <div class="banner">
    <full-carousel>
      <NuxtImg
        v-for="(e, i) in paths"
        @click="$router.push(e)"
        :key="i"
        class="h-[414px] cursor-pointer object-cover"
        :src="`/images/home-top-banner-${i + 1}.jpg`"
        :alt="`banner-${i + 1}`"></NuxtImg>
    </full-carousel>
  </div>
</template>
<script setup lang="ts">
const paths = ["/asset", "/designer", "/limit-asset"]
</script>
