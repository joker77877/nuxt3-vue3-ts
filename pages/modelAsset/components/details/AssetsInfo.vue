<template>
  <div class="pt-[28px]">
    <div class="mb-4 flex justify-between">
      <div class="flex items-end">
        <a-tooltip :title="detail.name" placement="top">
          <h1 class="mr-6 max-w-[300px] 2xl:max-w-[500px] truncate text-[24px] leading-[34px] font-medium" :title="detail.name">
            {{ detail.name }}
          </h1>
        </a-tooltip>
        <div v-if="isPreView" class="flex overflow-hidden rounded mr-4 text-xs leading-[25px]">
          <span class="limit-tag-gradient text-[rgba(35,40,51,0.85)] px-2">限量</span>
          <span class="bg-[#232833] px-2">
            <span class="limit-text-gradient">
              {{ stock }}
            </span>
          </span>
        </div>
        <div class="flex leading-5 mr-3 text-[#999]">
          <icon-eye class="w-5 h-5 mr-2"></icon-eye>
          <span>{{ detail.browseCount }}</span>
        </div>
        <div class="flex leading-5 mr-3 text-[#999]" :class="{ 'cursor-pointer': !isPreView }">
          <icon-like class="w-5 h-5 mr-1"></icon-like>
          <span>{{ detail.collectionCount }}</span>
        </div>
        <div
          v-if="detail.favorite"
          class="flex leading-5 mr-3 text-[#999]"
          :class="{ 'cursor-pointer': !isPreView }"
          v-debounce="cancelFavoriteHandle">
          <icon-star-full class="w-5 h-5 mr-1"></icon-star-full>
          <span>{{ detail.collectionCount }}</span>
        </div>
        <div v-else class="flex leading-5 mr-3 text-[#999]" :class="{ 'cursor-pointer': !isPreView }" v-debounce="favoriteHandle">
          <icon-star class="w-5 h-5 mr-1"></icon-star>
          <span>{{ detail.collectionCount }}</span>
        </div>
        <div v-if="isPreView" class="flex leading-5 mr-3 text-[#999]">
          <icon-share class="w-5 h-5 mr-1"></icon-share>
          <span>分享</span>
        </div>
        <a-popover v-else :overlay-inner-style="{ padding: 0 }">
          <template #content>
            <div class="share-content flx-column flx-center px-[37px] py-[44px]">
              <div class="title mb33 flx-align-center">
                <icon-wechat class="base-icon mr12 text-[#6CD550]"></icon-wechat>
                微信分享
              </div>
              <a-qrcode :value="currentPageUrl" :bordered="false" :size="200"></a-qrcode>
              <p class="tip mt25">扫一扫 二维码将文本分享到朋友圈</p>
            </div>
          </template>
          <div class="flex leading-5 mr-3 text-[#999]">
            <icon-share class="base-icon mr6"></icon-share>
            <span class="assets-icon">分享</span>
          </div>
        </a-popover>
      </div>
      <div v-if="detail.craterUserId !== detail.copyrightUserId && !isPreView" class="text-[#666]">
        <span>该作品原创设计者：</span>
        <span>{{ createUserName }}</span>
      </div>
    </div>
    <div class="mb-8" v-html="detail.description"></div>
    <div class="flex mb-[18px]">
      <span class="flex-shrink-0">分类：</span>
      <span class="flex-1">{{ detail.categoryName }}</span>
    </div>
    <div v-if="props.spuType === ProductSpuType.ASSET" class="flex mb-[18px] leading-5">
      <span class="flex-shrink-0">标签：</span>
      <div class="flex flex-wrap">
        <el-tooltip effect="dark" v-for="tag in detail.tags" :key="tag" :content="tag" placement="top">
          <span class="px-3 text-[12px] bg-[#F5F5F5] mr-[6px] mb-[6px] rounded-full truncate max-w-[300px]">{{ tag }}</span>
        </el-tooltip>
      </div>
    </div>
    <div v-else class="flex mb-[24px]">
      <span class="flex-shrink-0">发行方：</span>
      <span class="flex-1">{{ detail.publisher }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
// import QRCode from "qrcodejs2-fix"

const { checkIsLogin } = useCheckIsLogin()
interface Props {
  assetsDetail: Product.ProductDetail
  spuType: number
  isPreView?: boolean
  stock?: number
}
const props = withDefaults(defineProps<Props>(), {
  isPreView: false,
  stock: 0
})

const detail = computed(() => props.assetsDetail)
const createUserName = ref<string>("")
const currentPageUrl = ref<string>(window.location.href)

const getCreateUserInfo = async () => {
  try {
    const data = await getProductDesignerInfo(props.assetsDetail.craterUserId)

    createUserName.value = (data as any).nickname
  } catch (err) {
    console.log("获取原创作者报错", err)
  }
}

onMounted(() => {
  if (props.assetsDetail.craterUserId !== props.assetsDetail.copyrightUserId) {
    getCreateUserInfo()
  }
})
// 收藏
const favoriteHandle = async () => {
  if (props.isPreView) return
  try {
    if (!checkIsLogin()) return
    await favoriteProduct(props.assetsDetail.id)
    message.success("收藏成功")
    detail.value.collectionCount += 1
    detail.value.favorite = true
  } catch (err) {
    console.log("收藏失败", err)
  }
}
// 取消收藏
const cancelFavoriteHandle = async () => {
  if (props.isPreView) return
  try {
    if (!checkIsLogin()) return
    await cancelFavoriteProduct(props.assetsDetail.id)

    message.success("取消收藏成功")
    detail.value.collectionCount -= 1
    detail.value.favorite = false
  } catch (err) {
    console.log("取消收藏失败", err)
  }
}
</script>
