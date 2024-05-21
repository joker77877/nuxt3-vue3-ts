<template>
  <div class="success-container">
    <slot></slot>
    <div class="success-detail">
      <h2 class="title-2 mt30 mb60">{{ props.message }}</h2>
      <el-button v-if="isAction" type="primary" @click="$emit('change')">{{ btnMessage || "确定" }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="EmptyPage">
const props = defineProps({
  message: {
    type: String,
    default: "成功"
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
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #ffffff;
}
</style>
