<template>
  <div class="private-message-wrapper flx-center">
    <div class="content flx-column">
      <div class="title">写私信</div>
      <div class="pt25 pl30 pr30">
        <div class="nickname mb25 pl20">{{ designerName }}</div>
        <el-input
          class="msg-box"
          :rows="5"
          maxlength="600"
          placeholder="说点什么吧..."
          v-model="msgContent"
          show-word-limit
          type="textarea"
          resize="none"></el-input>
        <div class="mt15">
          <Emote @add-emote="addEmoteHandle"></Emote>
        </div>
        <el-button type="primary" class="send-btn mt20" v-debounce="sendPrivateMsgHandle">确定</el-button>
        <span class="cancel-btn" @click="closePopupHandle">取消</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Emote from "@/components/Emote/index.vue"

interface Props {
  designerName: string
}

const { designerName } = defineProps<Props>()
const emit = defineEmits(["close-popup"])
const msgContent = ref("")

// TODO 联调发送私信接口
const sendPrivateMsgHandle = () => {
  console.log("发送私信")
}

const addEmoteHandle = (emoteStr: string) => {
  msgContent.value += emoteStr
}

const closePopupHandle = () => {
  emit("close-popup")
}
</script>
<style lang="scss" scoped>
.private-message-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 30%);
  .content {
    display: flex;
    width: 514px;
    height: 519px;
    background-color: white;
    border-radius: 10px;
    .title {
      height: 65px;
      padding-left: 30px;
      font-size: var(--el-font-size-medium);
      font-weight: 500;
      line-height: 65px;
      color: var(--el-color-info);
      border-bottom: 1px solid #ebebed;
    }
    .nickname {
      width: 100%;
      height: 58px;
      font-size: var(--el-font-size-base);
      font-weight: 400;
      line-height: 58px;
      color: var(--el-text-color-regular);
      background: #f5f5f5;
      border: 1px solid #cccccc;
      border-radius: 10px;
    }
    .send-btn {
      width: 100%;
      height: 48px;
    }
    .cancel-btn {
      display: block;
      width: 100%;
      margin-top: 15px;
      line-height: 48px;
      color: $primary-color;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.msg-box {
  .el-textarea__inner {
    padding: 18px 13px;
    border-radius: 10px;
  }
}
</style>
