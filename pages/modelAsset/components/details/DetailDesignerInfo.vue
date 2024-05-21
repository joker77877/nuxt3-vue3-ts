<template>
  <div v-if="designerInfo" class="border-[#EBEBED] border-solid border-t border-b flex-items-center py-6 justify-between">
    <div class="flx-align-center leading-[22px]">
      <!-- TODO 添加跳转个人中心页面 -->
      <Image class="mr-[18px] w-[60px] h-[60px] rounded-full" :is-avatar="true" :pic-url="designerInfo.avatar"></Image>
      <div>
        <!-- TODO 添加跳转个人中心页面 -->
        <div class="max-w-[550px] mb-1 font-medium text-[16px] truncate">{{ designerInfo.nickname }}</div>
        <div class="text-[#999]">
          <span class="mr-4">{{ designerInfo.fansNum }} 粉丝</span>
          <span class="mr-4">{{ designerInfo.attentionNum }} 关注</span>
          <span class="mr-4">{{ designerInfo.areaName }}{{ designerInfo.role && "/" }}{{ designerInfo.role }}</span>
        </div>
      </div>
    </div>
    <div class="flx-align-center">
      <a-tooltip :title="isSelf ? '不能给自己发私信' : ''" :disabled="!isSelf" placement="top">
        <a-button class="mr-3 w-[84px] border-regular" :disabled="isSelf" @click="showPrivateMessageHandle">私信</a-button>
      </a-tooltip>
      <a-button v-if="designerInfo.attention" type="primary" v-debounce="cancelFollowHandle">取消关注</a-button>
      <a-tooltip v-else :title="isSelf ? '不能关注自己' : ''" :disabled="!isSelf" placement="top">
        <a-button class="w-[84px]" type="primary" :disabled="isSelf" v-debounce="followHandle">关注</a-button>
      </a-tooltip>
    </div>
  </div>
  <!-- 发送私信 -->
  <Teleport to="body">
    <SendPrivateMessage
      v-if="showPrivateMessage"
      :designer-name="designerInfo.nickname"
      @close-popup="showPrivateMessage = false"></SendPrivateMessage>
  </Teleport>
</template>
<script setup lang="ts">
const { checkIsLogin } = useCheckIsLogin()
interface Props {
  designerId: number
  isSelf: boolean
}
const { designerId, isSelf } = defineProps<Props>()

const route = useRoute()

const designerInfo = ref()
const showPrivateMessage = ref(false)

// 获取设计师详情
const getDesignerInfoHandle = async () => {
  try {
    const data = await getProductDesignerInfo(designerId)

    designerInfo.value = data
    designerInfo.value.role = USER_ROLES[data.userRole]
  } catch (err) {
    console.log("获取设计师详情报错", err)
  }
}
onMounted(() => {
  getDesignerInfoHandle()
})

watch(route, () => {
  if (route.name !== "designer") {
    return
  }
  getDesignerInfoHandle()
})

$bus.on("refreshData", () => {
  getDesignerInfoHandle()
})

// 关注
const followHandle = async () => {
  try {
    if (!checkIsLogin()) return
    await followDesigner(designerId)

    message.success("关注成功")
    getDesignerInfoHandle()
  } catch (err) {
    console.log("关注失败", err)
  }
}

// 取消关注
const cancelFollowHandle = async () => {
  try {
    if (!checkIsLogin()) return
    await cancelFollowDesigner(designerId)

    message.success("取消关注成功")
    getDesignerInfoHandle()
  } catch (err) {
    console.log("取关失败", err)
  }
}

// 显示发送私信
const showPrivateMessageHandle = () => {
  if (!checkIsLogin()) return
  showPrivateMessage.value = true
}

// TODO 联调发送私信
</script>
