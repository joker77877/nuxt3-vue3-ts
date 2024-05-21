<template>
  <div class="emotes-wrapper">
    <icon-emote class="w-[18px] h-[18px] text-[#A6A6A6] cursor-pointer" @click="faceContent"></icon-emote>
    <!-- 表情区域 -->
    <div class="browBox" v-if="faceShow">
      <ul>
        <li v-for="(item, index) in faceList" :key="index" @click="getBrow(index)">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
// 导入JSON格式的表情库
import emotesData from "@/components/Emote/emotes"

interface EmotesList {
  [key: string]: any
}

const emit = defineEmits(["addEmote"])
const faceShow = ref(false)
const faceList = ref<string[]>([])
// 表情
const faceContent = () => {
  faceShow.value = !faceShow.value
  if (faceShow.value === true) {
    Object.keys(emotesData).forEach((key) => {
      const { char } = (emotesData as EmotesList)[key]
      faceList.value.push(char)
    })
  } else {
    faceList.value = []
  }
}

// 获取用户点击之后的标签 ，存放到输入框内
const getBrow = (index: number) => {
  const getBrowString: string = faceList.value[index]
  emit("addEmote", getBrowString)
  faceShow.value = false
}
</script>
<style lang="scss" scoped>
.emotes-wrapper {
  position: relative;
  .browBox {
    position: absolute;
    bottom: 30px;
    width: 500px;
    height: 200px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow: scroll;
    background: #e6e6e6;
    border-radius: 10px;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 14%;
        font-size: 26px;
        text-align: center;
        list-style: none;
        cursor: pointer;
      }
    }
  }
}
</style>
