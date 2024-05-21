<template>
  <div class="empty-container">
    <slot></slot>
    <div class="empty-detail">
      <h3 class="title-3 mt30 mb60">{{ props.message }}</h3>
      <el-button v-if="isAction" type="primary" @click="$emit('change')">{{ btnMessage || "确定" }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="EmptyPage">
const props = defineProps({
  message: {
    type: String,
    default: "暂时没有数据哦"
  },
  btnMessage: String,
  isAction: {
    type: Boolean,
    default: true
  }
})
defineEmits(["change"])
</script>

<style scoped lang="scss">
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #ffffff;
  .empty-detail {
    text-align: center;
  }
}
</style>
