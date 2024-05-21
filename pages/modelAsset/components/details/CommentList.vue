<template>
  <div class="mt-8">
    <div class="flex">
      <!-- TODO 点击进入个人中心 -->
      <Image class="mr-[18px] w-[60px] h-[60px] rounded-full" :is-avatar="true" :pic-url="userAvatar"></Image>
      <div class="flex-1">
        <a-textarea
          class="textarea"
          :maxlength="200"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请发表您的评论和反馈请"
          v-model:value="commentContent"
          show-count></a-textarea>
        <div class="mt-[18px] flex justify-between">
          <Emote @add-emote="addEmoteHandle"></Emote>
          <a-button type="primary" class="w-[112px]" :disabled="!commentContent" v-debounce="sendCommentHandle">
            发布评论
          </a-button>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-10 pl-[78px]" ref="scrollContainer">
    <div class="flex mb-8" v-for="comment in commentList" :key="comment.id">
      <Image class="mr-4 w-[40px] h-[40px] rounded-full" :is-avatar="true" :pic-url="comment.userAvatar"></Image>
      <div class="flex-1">
        <div class="leading-[22px] pb-1 font-medium text-[16px] truncate">
          {{ comment.userNickname }}
        </div>
        <div class="mb-3 text-[12px] leading-[16px] text-[#999]">{{ comment.time }}</div>
        <div class="leading-6">
          {{ comment.content }}
        </div>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="leading-10 text-center">加载中...</div>
</template>
<script setup lang="ts">
const { checkIsLogin } = useCheckIsLogin()
const { isScrollToBottom } = usePagination()

interface Props {
  productId: string
}
const authStore = useAuthStore()
const props = defineProps<Props>()
const scrollContainer = ref()
const commentContent = ref("")
const commentList = ref<Product.CommentItem[]>([])
const isLoading = ref(false)
const userAvatar = computed(() => authStore.userInfo?.avatar || "")

const pageNo = ref(1)
const pageSize = 10
const total = ref(0)

const needLoadMore = computed(() => isScrollToBottom.value && commentList.value.length < total.value && !isLoading.value)

// 获取产品评论
const getProductCommentHandle = async () => {
  try {
    isLoading.value = true
    const data = await getProductComment({
      pageNo: pageNo.value,
      pageSize,
      spuId: props.productId
    })

    total.value = data.total
    const ret = data.list.map((item: Product.CommentItem) => ({
      ...item,
      time: timeAgo(item.createTime)
    }))
    commentList.value = [...commentList.value, ...ret]
    isLoading.value = false
  } catch (err) {
    console.log("获取产品评论报错", err)
  }
}

onMounted(() => {
  // 获取评论列表
  getProductCommentHandle()
})

watch(
  props,
  () => {
    pageNo.value = 1
    commentList.value = []
    getProductCommentHandle()
  },
  {
    deep: true
  }
)

watch(needLoadMore, (newValue) => {
  if (newValue) {
    pageNo.value += 1
    getProductCommentHandle()
    isScrollToBottom.value = false
  }
})

const addEmoteHandle = (emoteStr: string) => {
  commentContent.value += emoteStr
}

// 发布评论
const sendCommentHandle = async () => {
  try {
    if (!checkIsLogin()) return
    await publishProductComment({
      content: commentContent.value,
      spuId: props.productId
    })

    message.success("发布评论成功")
    commentContent.value = ""
    pageNo.value = 1
    commentList.value = []
    getProductCommentHandle()
  } catch (err) {
    console.log("发布评论报错", err)
  }
}
</script>
<style scoped lang="scss">
.textarea {
  &::after {
    position: absolute;
    right: 12px;
    bottom: 6px;
  }
}
</style>
