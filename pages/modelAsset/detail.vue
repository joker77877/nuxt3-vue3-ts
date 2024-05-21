<template>
  <detail-wrap v-if="assetsDetail">
    <template #left>
      <div class="h-[565px]">
        <RenderCanvas v-if="canvasFileUrl" :pic-url="assetsDetail.picUrl" :file-url="canvasFileUrl" :type="2"></RenderCanvas>
      </div>
      <AssetsInfo
        :spu-type="ProductSpuType.ASSET"
        :assets-detail="assetsDetail"
        @refresh-detail="getAssetsDetailHandle"></AssetsInfo>
      <DetailDesignerInfo
        :designer-id="assetsDetail.copyrightUserId"
        :is-self="assetsDetail.visitorIsCreator"></DetailDesignerInfo>
      <CommentList :product-id="assetsDetail.id" ref="commentListRef"></CommentList>
    </template>
    <template #right>
      <!-- 仅分享展示其他推荐作品 -->
      <RecommendList :product-id="assetsDetail.id" v-if="assetsDetail.publishType === ProductPublishType.SHARE"></RecommendList>
      <template v-else>
        <div v-if="assetsDetail.publishType === ProductPublishType.FREE" class="free-box border-box mb33">
          <div class="price mb20">
            <span>¥ 免费</span>
          </div>
          <div class="buy-group flx-align-center">
            <el-button type="primary" class="flex-full" size="large" @click="showDownLoadHandle()">
              <icon-download class="base-icon mr12"></icon-download>
              立即下载
            </el-button>
          </div>
        </div>
        <Copyright
          v-if="copyrightType && assetsDetail.publishType === ProductPublishType.NORMAL"
          :is-self="assetsDetail.visitorIsCopyright"
          :product-id="assetsDetail.id"
          :copyright-type="copyrightType"
          :copyright-tabs="copyrightTabs"
          @show-download="showDownLoadHandle"
          @add-cart="handlerAddCart"
          @buy-action="handlerBuyAction"
          @pay-action="handlerPay"></Copyright>
        <a-button
          v-if="assetsDetail.spuType === ProductSpuType.ALL"
          @click="$router.push(`/limit-asset/${assetsId}`)"
          size="large"
          type="default"
          class="border-blue text-blue mb-[28px]"
          block>
          去购买该3d模型的限量数字藏品
        </a-button>
        <ResourceInfo ref="resourceInfoRef" :id="assetsDetail.id"></ResourceInfo>
        <TradeRecords :spu-type="ProductSpuType.ASSET" :product-id="assetsDetail.id"></TradeRecords>
      </template>
    </template>
  </detail-wrap>
  <Download
    v-if="showPopup"
    @close-download="showPopup = false"
    :product-id="assetsDetail?.id || 0"
    :order-id="orderId"></Download>
</template>
<script setup lang="ts">
const ResourceInfo = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/ResourceInfo.vue"))
const Copyright = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/Copyright.vue"))
const TradeRecords = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/TradeRecords.vue"))
const DetailDesignerInfo = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/DetailDesignerInfo.vue"))
const CommentList = defineAsyncComponent(() => import("@/pages/modelAsset/components/details/CommentList.vue"))
const cartStore = useCartStore()
const { checkIsLogin } = useCheckIsLogin()
const COPY_RIGHT_TYPES = [
  {
    id: ProductCopyRightType.NORMAL,
    key: "personal",
    name: "个人授权",
    price: "0"
  },
  {
    id: ProductCopyRightType.COMPANY,
    key: "company",
    name: "企业授权",
    price: "0"
  },
  {
    id: ProductCopyRightType.COPYRIGHT,
    key: "copyright",
    name: "版权出售",
    price: "0"
  }
]
const route = useRoute()
const assetsId = ref<string>(route.params.id as string)

const showPopup = ref(false)
const commentListRef = ref()
const copyrightTabs = ref<CopyrightTabItem[]>([])
const copyrightType = ref()
const orderId = ref()
const canvasFileUrl = ref()
const modelConfiguration = ref<Object>({})

const assetsDetail = ref<Product.ProductDetail>()

const showDownLoadHandle = (id?: number) => {
  if (!checkIsLogin()) return
  showPopup.value = true
  if (id) {
    orderId.value = id
  }
}
const loading = ref(false)
// 加入购物车
const handlerAddCart = async (rightType: number) => {
  if (!assetsDetail.value) return
  await cartStore.addProduct({ count: 1, spuId: assetsDetail.value?.id, rightType })
  message.success("加入购物车成功")
}

// 获取详情
const getAssetsDetailHandle = async () => {
  try {
    const data: any = await getProductDetail(assetsId.value)
    assetsDetail.value = data
    // 作品路径
    const fileResourceUrlsResp = data.fileResourceInfoRespDTO?.fileResourceUrlsRespDTO
    // 模型配置
    if (data.fileResourceInfoRespDTO.editInfo) {
      modelConfiguration.value = JSON.parse(data.fileResourceInfoRespDTO.editInfo)
    }
    if (fileResourceUrlsResp) {
      canvasFileUrl.value = fileResourceUrlsResp.gltfFileURL || fileResourceUrlsResp.fileURL
    }
    // 组装版权数据
    const tabs: CopyrightTabItem[] = []
    const PRICES = ["personalPrice", "enterprisesPrice", "copyrightPrice"]
    data.saleMode.forEach((item: number) => {
      const copyRight = COPY_RIGHT_TYPES[item - 1]
      copyRight.price = (data as any)[PRICES[item - 1]]
      tabs.push(copyRight)
    })
    copyrightTabs.value = tabs
    if (tabs.length) {
      copyrightType.value = tabs[0].id
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
    } else {
      message.error(err.msg)
    }
  }
}

const handlerBuyAction = async (rightType: number) => {
  loading.value = true
  try {
    if (!assetsDetail.value) return
    const data = await createOrder({
      items: [
        {
          spuId: assetsDetail.value?.id,
          count: 1,
          rightType
        }
      ]
    })
    if (data.existInvalidSpu) {
      ElMessageBox.alert("该作品已失效或版权出售中", "提示", {
        confirmButtonText: "确定",
        callback: () => {
          // cartStore.getCartDetail()
          getAssetsDetailHandle()
        }
      })
    } else {
      cartStore.getCartDetail()
      navigateTo(`/order/list?id=${data.id}&pid=${data.payOrderId}`)
    }
  } catch (error) {
    loading.value = false
  }
}
// 去支付
const handlerPay = (orderIdVal: number, payId: number) => {
  navigateTo(`/order/list?id=${orderIdVal}&pid=${payId}`)
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
