<template>
  <!-- 这些样式是为了兼容以前用el-image -->
  <div class="el-image relative inline-block overflow-hidden">
    <a-image
      width="100%"
      height="100%"
      :src="`${picUrl || defaultImg}`"
      class="object-cover"
      loading="lazy"
      :preview="false"
      :fallback="defaultImg"
      v-bind="$attrs">
      <!-- <template #placeholder>
        <div class="h-full w-full bg-gray-100"></div>
      </template> -->
    </a-image>
  </div>
</template>
<script setup lang="ts">
interface Props {
  picUrl?: string
  isAvatar?: boolean
}
const { picUrl, isAvatar } = defineProps<Props>()
const defaultImg = isAvatar ? DEFAULT_AVATAR_IMG : DEFAULT_ERROR_IMG
</script>
<style lang="scss" scoped></style>
