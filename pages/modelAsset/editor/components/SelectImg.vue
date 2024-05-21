<template>
  <div ref="selectImgRef" class="select-imgs" :class="item.className">
    <div class="selected-box flx-justify-between pl20 pr20 rounded-[4px] bg-[#3F4D6D]">
      <span class="text-[14px] font-[400]">{{ item.selectedOption?.name }}</span>
      <div class="more-btn text-[12px]" @click="openOptionHandle">更多</div>
    </div>
    <NuxtImg class="mt14 rounded-[10px]" :src="item.selectedOption?.thumbnailUrl"></NuxtImg>
    <Teleport to="body">
      <!-- :style="{ top: `${selectImgTop}px` }" -->
      <div class="option-list" v-if="showImgListOptions">
        <div class="selected-box flx-justify-between pl20 pr20 h-[34px] rounded-t-[4px] bg-[#3F4D6D]">
          <span class="text-[14px] font-[400]">{{ item.optionsTitle }}</span>
          <icon-close @click="showImgListOptions = false"></icon-close>
        </div>
        <div class="option-item-wrapper">
          <div
            class="option-item"
            v-for="option in item.options"
            :key="option.id"
            :class="[option.id === item.selectedOption?.id ? 'active' : '', item.disabled ? 'cursor-not-allowed' : '']"
            @click="chooseOptionHandle(item, option)">
            <NuxtImg class="img" :src="option.thumbnailUrl"></NuxtImg>
            <div class="title sle">{{ option.name }}</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { ModelConfigItem, OptionItem } from "../config"

interface Props {
  info: any
}
const props = defineProps<Props>()
const emit = defineEmits(["change"])
const item = ref(props.info)
const showImgListOptions = ref(false)
const selectImgRef = ref()

const openOptionHandle = () => {
  // const rect = selectImgRef.value?.getBoundingClientRect()
  // selectImgTop.value = rect?.top
  showImgListOptions.value = true
}
const chooseOptionHandle = (optionItem: ModelConfigItem, option: OptionItem) => {
  optionItem.selectedOption = option
  showImgListOptions.value = false
  emit("change", option)
}
</script>
<style lang="scss" scoped>
.select-imgs {
  position: relative;
  .selected-box {
    width: 100%;
    height: 34px;
    span {
      color: #ffffff;
    }
    .more-btn {
      width: 50px;
      height: 22px;
      font-weight: 400;
      line-height: 22px;
      color: #ffffff;
      text-align: center;
      text-transform: capitalize;
      cursor: pointer;
      border: 1px solid #ffffff;
      border-radius: 4px;
    }
  }
}
.option-list {
  position: fixed;
  bottom: 0;
  left: 294px;
  z-index: 10000;
  width: 329px;
  background: var(--el-text-color-regular);
  border-radius: 10px;
  .selected-box {
    span,
    svg {
      color: #ffffff;
    }
    svg {
      cursor: pointer;
    }
  }
  .option-item-wrapper {
    height: 600px;
    overflow: auto;
    .option-item {
      position: relative;
      padding-right: 20px;
      padding-left: 20px;
      margin-top: 12px;
      cursor: pointer;
      border-radius: 10px;
      .img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
      .title {
        position: absolute;
        bottom: 0;
        left: 20px;
        display: block;
        padding: 0 10px;
        margin-bottom: 0;
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        color: #ffffff;
        background-color: rgb(0 0 0 / 35%);
        border-radius: 0 10px;
      }
    }
  }
}
</style>
