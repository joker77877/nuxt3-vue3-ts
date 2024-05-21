<template>
  <span class="u-tag">{{ props.value }}</span>
</template>

<script setup lang="ts" name="UTag">
const props = defineProps({
  value: String
})
</script>
<style scoped lang="scss">
.u-tag {
  display: inline-block;
  padding: 5px 10px;
  color: var(--el-color-primary);
  border: 1px solid #a6a6a6;
  border-radius: 6px;
}
</style>
