<template>
  <a-modal v-model:open="open" width="1000px" :body-style="{ padding: '40px 30px' }" :force-render="true" :footer="null">
    <span class="tips">
      <i class="base-icon mr8"><icon-info></icon-info></i>
      预览中，作品尚未发布，预览地址仅对自己可见
    </span>
    <div class="detail-content mt30 mb50" v-if="assetsDetail">
      <div class="left">
        <div class="assets-img-box mb32">
          <RenderCanvas
            v-if="assetsDetail?.canvasFileUrl"
            :pic-url="assetsDetail.picUrl"
            :file-url="assetsDetail.canvasFileUrl"
            canvas-id="preview-edit"
            :type="2"></RenderCanvas>
        </div>
        <AssetsInfo :assets-detail="assetsDetail" :spu-type="ProductSpuType.LIMIT" :is-pre-view="true"></AssetsInfo>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
interface DetailVO extends Product.ProductDetail {
  fileResourceId: string
  canvasFileUrl: string
  picUrl: string
}
const open = ref<boolean>(false)
const assetsDetail = ref<DetailVO>()

const openDialog = (detail: DetailVO) => {
  open.value = true
  assetsDetail.value = detail
}

defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped>
.tips {
  position: absolute;
  top: 15px;
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  font-size: 13px;
  color: #115ee8;
  background: #ecf5ff;
  border-radius: 2px;
}
.detail-content {
  margin-top: 30px;
  .left {
    flex: 1;
    .assets-img-box {
      position: relative;
      height: 566px;
      .full-screen {
        position: absolute;
        right: 25px;
        bottom: 18px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        background: rgb(35 40 51 / 50%);
        border-radius: 4px;
      }
    }
    .picture {
      width: 100%;
      height: 580px;
      border: 1px solid #cccccc;
      border-radius: 10px;
      box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
    }
    .detail-title {
      font-size: 24px;
      font-weight: 500;
      line-height: 30px;
      color: var(--el-text-color-regular);
      letter-spacing: -0.72px;
    }
    .viewed {
      font-family: Inter;
      font-size: var(--el-font-size-base);
      font-weight: 400;
      color: var(--el-color-info);
    }
    .collection span,
    .share span {
      margin-left: 6px;
      font-size: var(--el-font-size-base);
      font-weight: 400;
      line-height: 22px;
      color: var(--el-color-info-light-3);
    }
    .info,
    .categories-title,
    .tags-title,
    .categories-item {
      font-size: var(--el-font-size-base);
      font-weight: 400;
      line-height: 22px;
      color: var(--el-text-color-regular);
    }
    .info {
      font-size: var(--el-font-size-medium);
    }
    .assets-user-avatar,
    .user-avatar {
      display: block;
      width: 60px;
      height: 60px;
      border-radius: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
.share-content {
  .title {
    font-size: var(--el-font-size-large);
    font-weight: 500;
    line-height: 22px;
    color: var(--el-text-color-regular);
  }
  .tip {
    font-size: var(--el-font-size-base);
    font-weight: 500;
    line-height: 22px;
    color: var(--el-color-info);
  }
}
</style>
