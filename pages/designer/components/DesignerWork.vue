<template>
  <div class="work-item" @click="goDetailHandle">
    <Image class="work-img" :pic-url="designerWork.picUrl"></Image>
    <div class="info flx-justify-between pl10 pr10">
      <span class="name sle">{{ designerWork.name }}</span>
      <div class="browse-num flx-align-center">
        <icon-eye class="eye-icon mr5"></icon-eye>
        <span class="num">{{ designerWork.browseCount }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  designerWork: Product.ProductItem
}
const { designerWork } = defineProps<Props>()

const router = useRouter()

const goDetailHandle = () => {
  router.push(`/asset/${designerWork.id}`)
}
</script>
<style lang="scss" scoped>
.work-item {
  position: relative;
  flex: 1;
  cursor: pointer;
  border-radius: 8px;
  &:hover {
    .info {
      opacity: 1;
    }
  }
  .work-img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  .info {
    position: absolute;
    bottom: 8px;
    left: 0;
    width: 100%;
    opacity: 0;
    transition: opacity 0.3s;
    .name,
    .browse-num .num {
      font-size: var(--el-font-size-base);
      font-weight: 400;
      line-height: 22px;
      color: #ffffff;
    }
    .name {
      flex: 1;
      max-width: 140px;
    }
    .eye-icon {
      color: #ffffff;
    }
  }
}
:deep(.work-img) {
  &.el-image,
  .ant-image {
    display: block !important;
  }
}
</style>
