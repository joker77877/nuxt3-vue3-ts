<template>
  <a-modal
    :footer="null"
    @cancel="handle(false)"
    :after-close="onClose"
    :wrap-class-name="wrapClass"
    v-model:open="visible"
    width="400px"
    centered>
    <div class="icon-wrap">
      <component :is="icon || iconName[type]" class="h-[30px] w-[30px]"></component>
    </div>
    <div class="title">{{ title }}</div>
    <div v-if="message" class="message">
      {{ message }}
    </div>
    <div class="btns">
      <a-button v-if="showOk" class="mb-[15px]" @click="handle(true)" size="large" :danger="type === 'warning'" type="primary">
        {{ okText }}
      </a-button>
      <a-button
        v-if="showCancel"
        :class="[type === 'warning' ? 'text-[#a6a6a6]' : 'text-[#115EE8]']"
        @click="handle(false)"
        size="large"
        type="link">
        {{ cancelText }}
      </a-button>
    </div>
  </a-modal>
</template>
<script setup lang="tsx">
import type { MessageType, Options } from "./index"

const iconName = {
  warning: IconWarning,
  success: IconSuccess,
  confirm: IconInfo
}

const { title, message, type, icon, showCancel, showOk, okText, cancelText } = withDefaults(
  defineProps<
    {
      type: MessageType
    } & Options
  >(),
  { okText: "确定", cancelText: "取消", showOk: true, showCancel: true }
)
const wrapClass = `cus-message-dialog ${type}`

const emit = defineEmits(["confirm", "close"])
const visible = ref(true)

const handle = (isOk: boolean) => {
  visible.value = false
  emit("confirm", isOk)
}

const onClose = () => {
  emit("close")
}
</script>
<style lang="scss">
.cus-message-dialog {
  .ant-modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    padding-top: 35px;
    border-radius: 20px;
    .icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin: 20px 0;
      color: #ffffff;
      border-radius: 30px;
    }
    .title {
      padding-top: 25px;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
    }
    .message {
      padding-top: 12px;
      font-size: 12px;
      line-height: 22px;
      color: #232833;
    }
    .btns {
      width: 100%;
      padding-top: 35px;
      button {
        display: block;
        width: 100%;
        height: 48px;
        padding: 0;
        margin-left: 0;
        font-size: 16px;
      }
    }
  }
  &.warning {
    .icon-wrap {
      background-color: #e54850;
      box-shadow:
        0 0 0 20px rgb(229 72 80 / 10.2%),
        0 0 0 10px rgb(229 72 80 / 20%);
    }
  }
  &.success,
  &.confirm {
    .icon-wrap {
      background-color: #0cc399;
      box-shadow:
        0 0 0 20px rgb(12 195 153 / 10%),
        0 0 0 10px rgb(12 195 153 / 20%);
    }
  }
}
</style>
