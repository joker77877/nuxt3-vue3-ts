<template>
  <div class="recommend-list" v-if="recommendList?.length">
    <div
      class="recommend-item mb30"
      v-for="recommend in recommendList"
      :key="recommend.id"
      @click="goOtherDetailHandle(recommend.id)">
      <Image class="img" :pic-url="recommend.picUrl"></Image>
      <div class="title-box flx-justify-between pl18 pr18">
        <span class="title sle" :title="recommend.name">{{ recommend.name }}</span>
        <div class="info flx-align-center">
          <icon-eye class="base-icon mr2"></icon-eye>
          <span class="viewed mr17">{{ recommend.browseCount }}</span>
          <icon-comment class="base-icon mr2"></icon-comment>
          <span class="viewed mr17">{{ recommend.commentCount }}</span>
          <icon-star-one class="base-icon mr2 star"></icon-star-one>
          <span class="viewed">{{ recommend.collectionCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  productId: number
}
const props = defineProps<Props>()

const recommendList = ref<Product.RecommendItem[]>([])

const getRecommendListHandle = async () => {
  try {
    const data = await getProductRecommendList(props.productId)

    recommendList.value = data
  } catch (err) {
    console.log("获取getRecommendListHandle报错", err)
  }
}

onMounted(() => {
  getRecommendListHandle()
})

watch(
  props,
  () => {
    getRecommendListHandle()
  },
  {
    deep: true
  }
)

const goOtherDetailHandle = (id: number) => {
  navigateTo(`/asset/${id}`)
}
</script>
<style lang="scss" scoped>
.recommend-item {
  cursor: pointer;
  background: #f6f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
  .img {
    display: block;
    height: 305px;
    border-radius: 8px 8px 0 0;
  }
  .title-box {
    height: 52px;
    .title {
      max-width: 200px;
      font-size: var(--el-font-size-base);
      font-weight: 500;
      line-height: 22px;
      color: var(--el-text-color-regular);
    }
    .info {
      color: var(--el-color-info);
      .star {
        margin-bottom: -2px;
      }
      span {
        font-family: Inter;
        font-size: var(--el-font-size-extra-small);
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 183.333% */
        text-transform: capitalize;
      }
    }
  }
}
</style>
