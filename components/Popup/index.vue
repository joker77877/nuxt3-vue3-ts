<template>
  <div class="popup-wrapper flx-center">
    <div class="content flx-column">
      <div class="title" v-if="title">{{ title }}</div>
      <p v-if="content">{{ content }}</p>
      <slot></slot>
      <!-- <footer>
        <slot name="footer">
          <el-button type="warning" size="large"> 取消 </el-button>
          <el-button type="primary" size="large"> 确认 </el-button>
        </slot>
      </footer> -->
      <el-icon class="close" @click="closePopupHandle"><Close></Close></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Close } from "@element-plus/icons-vue"

interface Props {
  title?: string
  content?: string
}
const { title, content } = defineProps<Props>()
const emit = defineEmits(["close-popup"])

const closePopupHandle = () => {
  emit("close-popup")
}
</script>
<style lang="scss" scoped>
.popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 30%);
  .content {
    position: relative;
    display: flex;
    width: 514px;
    height: 519px;
    padding: 25px;
    background-color: white;
    border-radius: 10px;
    .close {
      position: absolute;
      top: 25px;
      right: 25px;
      z-index: 10;
      font-size: 26px;
      cursor: pointer;
    }
  }
}
</style>
