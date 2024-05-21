<template>
  <el-dialog v-model="dialogVisible" title="下载" @close="$emit('close-download')" class="dialog-header-border-btm" width="688">
    <el-tabs class="download-wrapper" v-if="downloadList?.length" v-model="activeTabName">
      <el-tab-pane
        v-for="product in downloadList"
        :key="product.productId"
        :label="ellipsisStr(product.name)"
        :name="product.name">
        <div class="list mt10" v-if="downloadList">
          <div class="item flx-justify-between" v-for="item in product.fileResourceUrlList" :key="item.fileId">
            <div class="left">
              <div class="type-header flx-align-center mb5 pl8 pr8">
                <span class="type-name ftw500 text-capitalize">{{ FORMAT_NAMES[item.formatType - 1] }}</span>
                <span class="type-info ftw500">原始格式</span>
                <span class="empty"></span>
              </div>
              <div class="type-item flx-align-center pl8 pr16">
                <span>.{{ FORMAT_NAMES[item.formatType - 1] }}</span>
                <span>{{ item.fileSize || 0 }} MB</span>
                <!-- <span>纹理尺寸：2k</span> -->
                <div class="flex-full download-box">
                  <el-button type="primary" class="download-btn" @click="downloadFileHandle(item.fileURL)">下载</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-else-if="isLoading" class="download-wrapper flx-center">加载中...</div>
    <empty-page v-else message="暂无数据" class="w-[100%] border-box" :is-action="false">
      <NuxtImg src="/images/empty-works.png"></NuxtImg>
    </empty-page>
  </el-dialog>
</template>
<script setup lang="ts">
const FORMAT_NAMES = ["Glb", "Gltf", "其他"]

interface Props {
  productId?: number
  orderId?: number
}
const props = defineProps<Props>()
const emits = defineEmits(["close-download"])

const activeTabName = ref("")
const downloadType = ref<ProductDownloadType>(1)
const email = ref("")
const downloadList = ref<Product.ResDownloadList[]>()
const dialogVisible = true
const isLoading = ref(true)

onMounted(() => {
  getDownloadList()
})

const downloadFileHandle = (fileUrl: string) => {
  try {
    downloadFile(fileUrl)
  } catch (err) {
    console.log("下载失败", err)
  }
}

const getDownloadList = async () => {
  try {
    isLoading.value = true
    if (!props.productId && !props.orderId) {
      message.error("未提供作品id或者订单id")
      return
    }
    const params: any = {
      downLoadType: downloadType.value,
      email: email.value
    }
    if (props.productId) {
      params.productId = props.productId
    }
    if (props.orderId) {
      params.tradeOrderId = props.orderId
    }
    const data = await getProductFileList(params)

    downloadList.value = data as any
    activeTabName.value = data[0]?.name

    isLoading.value = false
  } catch (err: any) {
    console.log("获取下载信息报错", err)
    isLoading.value = false
    if (err?.code === 401) {
      emits("close-download")
    }
  }
}
</script>
<style lang="scss" scoped>
.download-title {
  padding-bottom: 17px;
  margin-bottom: 13px;
  line-height: 22px;
  color: var(--el-text-color-regular);
  border-bottom: 1px solid #cccccc;
}
.title {
  line-height: 22px;
  color: var(--el-text-color-regular);
}
.item {
  border-radius: 4px;
  box-shadow: 0 2px 5px 0 rgb(17 94 232 / 8%);
  opacity: 0.8;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  .left {
    display: flex;
    flex: 1;
    flex-direction: column;
    .type-header {
      justify-content: space-around;
      height: 32px;
      background: #f5f5f5;
      .type-name {
        flex: 1;
        font-size: var(--el-font-size-base);
        line-height: 22px;
        color: var(--el-text-color-regular);
      }
      .type-info {
        flex: 1;
        font-size: var(--el-font-size-base);
        line-height: 22px;
        color: #a6a6a6;
      }
      .empty {
        flex: 1;
      }
    }
    .type-item {
      height: 32px;
      &:not(:last-child) {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #cccccc;
      }
      span {
        flex: 1;
        font-size: var(--el-font-size-extra-small);
        font-weight: 500;
        line-height: 22px;
        color: #a6a6a6;
      }
      .download-box {
        display: flex;
        justify-content: right;
      }
    }
  }
  .download-btn {
    width: 50px;
    height: 23px;
    border-radius: 4px;
  }
}
</style>
<style lang="scss">
.dialog-header-border-btm {
  .el-dialog__header {
    padding-bottom: 0;
    margin-bottom: 30px;
    line-height: 22px;
    .el-dialog__title {
      font-size: 20px;
      font-weight: 500;
      color: var(--el-text-color-regular);
    }
  }
}
.download-wrapper {
  min-height: 296px;
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    width: auto;
    font-size: 14px;
    line-height: 27px;
  }
  .el-tabs__item {
    display: block;
    height: 22px;
    padding: 0 !important;
    margin-bottom: 14px;
    font-size: var(--el-font-size-base);
    font-weight: 400;
    line-height: 22px;
    color: #666666;
    &.is-active {
      font-size: var(--el-font-size-medium);
      font-weight: 500;
      color: var(--el-color-primary);
    }
    &:not(:last-child) {
      padding-right: 44px !important;
    }
  }
}
</style>
