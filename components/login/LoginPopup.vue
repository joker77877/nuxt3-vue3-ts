<template>
  <div class="register-wrapper flx-center">
    <div class="content">
      <div class="section left">
        <img class="register-img" src="/images/register-bg.png" alt="register" />
      </div>
      <div class="section right pt60 pl40 pr48">
        <span class="title mb33" v-if="title">{{ title }}</span>
        <div>
          <el-icon class="close" @click="closePopupHandle"><Close></Close></el-icon>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Close } from "@element-plus/icons-vue"

const { title } = defineProps({
  title: {
    type: String,
    default: "注册"
  }
})
const emit = defineEmits(["close-popup"])

const closePopupHandle = () => {
  emit("close-popup")
}
</script>

<style lang="scss" scoped>
.register-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 30%);
  .content {
    display: flex;
    width: 784px;
    height: 578px;
    background-color: white;
    border-radius: 10px;
    .section {
      flex: 1;
      width: 50%;
      &.left {
        height: 100%;
        background: #d9d9d9;
        border-radius: 10px 0 0 10px;
        .register-img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 10px 0 0 10px;
        }
      }
      &.right {
        position: relative;
        .close {
          position: absolute;
          top: 30px;
          right: 30px;
          font-size: 26px;
          cursor: pointer;
        }
        .title {
          display: block;
          font-size: 24px;
          font-weight: 600;
          line-height: 22px;
        }
      }
    }
  }
}
</style>
