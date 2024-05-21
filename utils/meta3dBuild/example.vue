<template>
  <div id="container">
    <canvas id="renderCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import Meta3DEngine from "@/meta3dBuild/Meta3DEngine"

let meta3DEngine: any = null
onMounted(() => {
  meta3DEngine = new Meta3DEngine("renderCanvas")
  meta3DEngine.init()
})
onBeforeUnmount(() => {
  meta3DEngine?.dispose()
  meta3DEngine = null
})
</script>
<style scoped>
#container {
  position: relative;
  width: 100%;
  height: 100%;
}
#container canvas {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
