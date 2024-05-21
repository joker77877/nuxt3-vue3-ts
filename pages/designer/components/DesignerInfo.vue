<template>
  <div class="designer-info">
    <Image :pic-url="designerInfo.avatar" :is-avatar="true" class="avatar" @click="goDesignerDetail"></Image>
    <div class="info-box">
      <div class="name ft18 ftw600 mb2 sle" @click="goDesignerDetail">{{ designerInfo.nickname }}</div>
      <div class="info flx-align-center mb17">
        <span class="sle province">{{ areaProvinceName }}</span>
        <span class="line">|</span>
        <span>{{ designerInfo.levelName }}</span>
      </div>
      <div class="nums flx-align-center mb20">
        <div>
          <span class="key-name">作品</span>
          <span class="num">{{ designerInfo.worksCount }}</span>
        </div>
        <div>
          <span class="key-name">粉丝</span>
          <span class="num">{{ designerInfo.fansNum }}</span>
        </div>
      </div>
      <a-button v-if="designerInfo.attention" class="follow-btn" v-debounce="cancelFollowHandle">已关注</a-button>
      <a-tooltip v-else :content="designerInfo.self ? '不能关注自己' : ''" :disabled="!designerInfo.self" placement="top">
        <a-button v-debounce="followHandle" :disabled="designerInfo.self" class="follow-btn">关注</a-button>
      </a-tooltip>
    </div>
  </div>
</template>
<script setup lang="ts">
const { checkIsLogin } = useCheckIsLogin()
interface Props {
  designerInfo: Designer.SearchDesignerItem
}
const props = defineProps<Props>()

const designerInfo = ref(props.designerInfo)

const areaProvinceName = computed(() => designerInfo.value.areaName.split(" ").at(-1))

const goDesignerDetail = () => {
  navigateTo(`/designer/${designerInfo.value.id}`)
}

// 关注
const followHandle = async () => {
  try {
    if (!checkIsLogin()) return
    await followDesigner(designerInfo.value.id)
    ElMessage.success("关注成功")
    designerInfo.value.attention = true
    designerInfo.value.fansNum += 1
  } catch (err) {
    console.log("关注失败", err)
  }
}

// 取消关注
const cancelFollowHandle = async () => {
  try {
    if (!checkIsLogin()) return
    await cancelFollowDesigner(designerInfo.value.id)
    ElMessage.success("取消关注成功")
    designerInfo.value.attention = false
    designerInfo.value.fansNum -= 1
  } catch (err) {
    console.log("取关失败", err)
  }
}
</script>
<style lang="scss" scoped>
.designer-info {
  display: flex;
  gap: 17px;
  width: 320px;
  .avatar {
    display: block;
    width: 100px;
    height: 100px;
    cursor: pointer;
    border-radius: 100px;
  }
  .info-box {
    .name {
      max-width: 200px;
      font-family: "PingFang HK";
      color: var(--el-text-color-regular);
      cursor: pointer;
    }
    .info {
      gap: 8px;
      span {
        display: block;
        font-size: var(--el-font-size-base);
        font-weight: 400;
        color: #a6a6a6;
        &.province {
          max-width: 100px;
        }
      }
      .line {
        margin-top: -2px;
      }
    }
    .nums {
      gap: 20px;
      .key-name {
        font-size: var(--el-font-size-base);
        font-weight: 400;
        color: var(--el-text-color-regular);
      }
      .num {
        margin-left: 4px;
        font-size: var(--el-font-size-medium);
        font-weight: 600;
        color: var(--el-text-color-regular);
      }
    }
    .follow-btn {
      width: 120px;
      height: 40px;
      background: #ffffff;
      border: 1px solid #ebebed;
      border-radius: 100px;
    }
  }
}
</style>
