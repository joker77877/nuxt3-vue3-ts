<template>
  <a-config-provider
    :theme="{
      components: {
        Button: {
          colorTextDisabled: '#F5F5F5',
          colorBgContainerDisabled: '#A6A6A6'
        }
      }
    }">
    <detail-wrap v-if="assetsDetail">
      <template #left>
        <div class="h-[565px]">
          <RenderCanvas v-if="canvasFileUrl" :pic-url="assetsDetail.picUrl" :file-url="canvasFileUrl" :type="2"></RenderCanvas>
        </div>
        <AssetsInfo
          :spu-type="ProductSpuType.LIMIT"
          :assets-detail="assetsDetail"
          @refresh-detail="getAssetsDetailHandle"></AssetsInfo>
        <DetailDesignerInfo
          :designer-id="assetsDetail.copyrightUserId"
          :is-self="assetsDetail.visitorIsCreator"></DetailDesignerInfo>
        <CommentList :product-id="assetsDetail.id" ref="commentListRef"></CommentList>
      </template>
      <template #right>
        <!-- 限量藏品购买流程 -->
        <limit-pay @update-detail="getAssetsDetailHandle" :detail="assetsDetail"></limit-pay>
        <a-button
          v-if="assetsDetail.spuType === ProductSpuType.ALL"
          @click="$router.push(`/asset/${assetsId}`)"
          size="large"
          type="default"
          class="border-blue text-blue mb-[28px]"
          block>
          去购买该3d模型的作品版权
        </a-button>
        <ResourceInfo ref="resourceInfoRef" :id="assetsDetail.id"></ResourceInfo>
        <TradeRecords :spu-type="ProductSpuType.LIMIT" :product-id="assetsDetail.id"></TradeRecords>
      </template>
    </detail-wrap>
  </a-config-provider>
</template>
<script setup lang="ts">
import DetailWrap from "./components/details/DetailWrap.vue"

const ResourceInfo = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/ResourceInfo.vue"))
const TradeRecords = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/TradeRecords.vue"))
const DetailDesignerInfo = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/DetailDesignerInfo.vue"))
const CommentList = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/CommentList.vue"))
const route = useRoute()
const assetsId = ref<string>(route.params.id as string)

const commentListRef = ref()
const canvasFileUrl = ref()

const assetsDetail = ref<Product.ProductDetail>()

// 获取详情
const getAssetsDetailHandle = async () => {
  try {
    const data: any = await getLimitAssetDetail(assetsId.value)
    assetsDetail.value = data
    // 作品路径
    const fileResourceUrlsResp = data.fileResourceInfoRespDTO?.fileResourceUrlsRespDTO
    if (fileResourceUrlsResp) {
      canvasFileUrl.value = fileResourceUrlsResp.gltfFileURL || fileResourceUrlsResp.fileURL
    }
  } catch (err: any) {
    if (err?.code && Object.values(ProductCodeState).includes(err?.code)) {
      const query: any = {
        code: err.code,
        productId: assetsId.value
      }
      if (err.code === ProductCodeState.SELF_OFF_SHELF) {
        const errData = JSON.parse(err.msg)
        query.oId = errData.orderId
      }
      navigateTo({
        path: "/asset-error",
        query
      })
    }
  }
}

onMounted(() => {
  getAssetsDetailHandle()
})

watch(route, () => {
  if (route.name !== "asdetail") {
    return
  }
  // 此处写监听路由后要执行的事情
  assetsId.value = route.params.id as string
  canvasFileUrl.value = ""
  getAssetsDetailHandle()
})

// 登录状态刷新后，刷新详情数据
$bus.on("refreshData", () => {
  getAssetsDetailHandle()
})
</script>
