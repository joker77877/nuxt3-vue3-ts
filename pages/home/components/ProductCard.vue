<!-- 产品card -->
<template>
  <div class="card-item">
    <dl class="item-wrap">
      <dt class="item-img">
        <div class="img-wrap" @click="goDetail">
          <Image :pic-url="product.picUrl" fit="fill" loading="lazy"></Image>
        </div>
        <span class="favorite-wrap" @click="handlerAddFavorite">
          <img :src="favoriteLight" v-if="product.favorite" class="h-[30px] w-[30px]" alt="icon" />
          <img :src="favorite" v-else class="h-[30px] w-[30px]" alt="icon" />
        </span>
      </dt>
      <!-- 底部信息 -->
      <dd class="group px-3 pb-[15px] pt-3">
        <div class="flex items-center justify-between font-medium leading-[22px]">
          <span class="flex-1 truncate text-[#09090A]" @click="goDetail">{{ product.name }}</span>
          <div v-if="PublishTypeEnum.Sell === product.publishType">
            <span class="mita-text-red group-hover:hidden">￥{{ price }}</span>
            <!-- 购物车图标 -->
            <span class="hidden group-hover:block" :class="cartWrapClass" @click="handlerAddCart">
              <icon-cart-one class="h-[20px] w-[20px] mita-text-red" :class="cartIconClass"></icon-cart-one>
            </span>
          </div>
          <!-- 下载图标 -->
          <div v-if="PublishTypeEnum.Download === product.publishType" class="danger-color cursor-pointer">
            <icon-download2 class="h-[20px] w-[20px]" @click="showDownLoadHandle"></icon-download2>
          </div>
          <!-- 分享图标 -->
          <div v-if="PublishTypeEnum.Share === product.publishType" class="danger-color cursor-pointer">
            <a-popover>
              <icon-share2 class="h-[20px] w-[20px]"></icon-share2>
              <template #content>
                <div class="flex flex-col py-[22px] px-[10px] leading-[22px] flex-items-center">
                  <div class="flx-align-center mb-5 text-[18px] font-medium">
                    <icon-wechat class="mr-3 text-[#6CD550]"></icon-wechat>
                    微信分享
                  </div>
                  <a-qrcode :value="qrCodeUrl" :bordered="false" :size="224"></a-qrcode>
                  <p class="mt-[22px] text-[#666]">扫一扫 二维码将文本分享到朋友圈</p>
                </div>
              </template>
            </a-popover>
          </div>
        </div>
        <!-- 上传用户与浏览数据 -->
        <div class="flex justify-between pt-2" v-if="!type">
          <div class="min-w-0 flex-1 flex-items-center">
            <Image class="h-[24px] w-[24px] rounded-full" is-avatar :pic-url="product.creatorUrl"></Image>
            <span class="ml-2 flex-1 truncate text-xs text-[rgba(35,40,51,0.5)]">
              {{ product.creator }}
            </span>
          </div>
          <div class="text-xs leading-3 text-[rgba(35,40,51,0.5)] flex-items-center">
            <icon-eye2 class="h-4 w-4"></icon-eye2>
            <span class="ml-1">{{ product.browseCount }}</span>
            <icon-collect2 class="ml-[10px] h-4 w-4"></icon-collect2>
            <span class="ml-1">{{ product.collectionCount }}</span>
          </div>
        </div>
      </dd>
    </dl>
  </div>
  <Download v-if="dialogVisible" @close-download="dialogVisible = false" :product-id="product.id"></Download>
</template>

<script setup lang="ts">
import favorite from "@/assets/icons/favorite.svg"
import favoriteLight from "@/assets/icons/favorite-light.svg"

const { checkIsLogin } = useCheckIsLogin()

const dialogVisible = ref(false)

//
const cartStore = useCartStore()
interface Props {
  productItem: Product.ProductItem
  rightType?: number // 授权类型
  /**
   * @description: 0为首页样式，1为商业对接详情作品样式
   */
  type?: 0 | 1
}
const props = withDefaults(defineProps<Props>(), { type: 0 })
const cartWrapClass = ref("")
const cartIconClass = ref("")
const product = reactive<Product.ProductItem>(props.productItem)
// 展示哪种价格
const price = computed(() => {
  // 根据后端规则，小于0表示未设置价格
  const isValid = (p: string) => (Number(p) < 0 ? "" : p)
  if (!isNil(props.rightType)) {
    switch (props.rightType) {
      case FILTER_COPYRIGHT_ENUM.PERSONAL:
        return product.personalPrice
      case FILTER_COPYRIGHT_ENUM.COMPANY:
        return product.enterprisesPrice
      case FILTER_COPYRIGHT_ENUM.COPYRIGHT:
        return product.copyrightPrice
      default:
        return isValid(product.personalPrice) || isValid(product.enterprisesPrice) || isValid(product.copyrightPrice)
    }
  } else {
    return isValid(product.personalPrice) || isValid(product.enterprisesPrice) || isValid(product.copyrightPrice)
  }
})

const showDownLoadHandle = () => {
  if (!checkIsLogin()) return
  dialogVisible.value = true
}

// 添加购物车
const handlerAddCart = async () => {
  // 添加动画效果
  cartWrapClass.value = "add-cart-wrap"
  cartIconClass.value = "add-cart-icon"
  setTimeout(() => {
    cartWrapClass.value = ""
    cartIconClass.value = ""
  }, 600)
  await cartStore.addProduct({
    count: 1,
    spuId: props.productItem.id,
    rightType: props.productItem.saleMode ? props.productItem.saleMode[0] : COPYRIGHT_TYPE_ENUM.PERSONAL_AUTH
  })
}
const handlerAddFavorite = async () => {
  if (product.favorite) {
    await cancelFavoriteProduct(product.id)
    product.collectionCount -= 1
  } else {
    await favoriteProduct(product.id)
    product.collectionCount += 1
  }
  product.favorite = !product.favorite
}
const goDetail = () => {
  // router.push(`/asset/${props.productItem.id}`)
  window.open(`/asset/${props.productItem.id}`, "_blank")
}

const qrCodeUrl = ref(`${window.location.host}/asset/${props.productItem.id}`)
</script>
<style lang="scss" scoped>
.card-item {
  overflow: hidden;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 20px -4px rgb(16 24 40 / 10%);
  dt.item-img {
    position: relative;
    &::after {
      display: block;
      padding-top: 67.57%;
      content: "";
    }
    .img-wrap {
      position: absolute;
      inset: 0;
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: "";
        background-color: rgb(16 15 22 / 50%);
        opacity: 0;
      }
      &:hover {
        & + .favorite-wrap {
          opacity: 1;
        }
        &::after {
          opacity: 1;
        }
      }
    }
    :deep(.el-image) {
      display: block;
      height: 100%;
    }
    .favorite-wrap {
      position: absolute;
      right: 22px;
      bottom: 22px;

      // pointer-events: none;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
      &:hover {
        opacity: 0.75;
      }
      &:active {
        opacity: 0.5;
        transition: opacity 0s;
      }
    }
  }
  .add-cart-exist {
    &:active {
      animation: shrink 0.5s;
      will-change: scale;
    }
  }
  .add-cart-icon {
    position: relative;
    animation: cart-jump 0.5s cubic-bezier(0.36, 1.5, 0.54, 1);
    will-change: transform, scale;
  }
  .add-cart-wrap {
    position: relative;
    &::before {
      position: absolute;
      bottom: calc(100% + 3px);
      left: calc(50% + 5px);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      font-size: 8px;
      font-weight: 700;
      color: #ffffff;
      color: var(--color-neutral-0, #ffffff);
      pointer-events: none;
      content: "+1";
      background-color: var(--el-color-danger);
      border-radius: 100%;
      opacity: 0;
      transform: translate(-50%);
      animation: fade-out-up 1s cubic-bezier(0, 0.26, 0.93, 0.85) 0.15s forwards;
      will-change: transform, opacity;
    }
  }

  @keyframes cart-jump {
    0% {
      transform: translateY(0) rotate(0) scale(1);
    }
    17% {
      transform: translateY(0) rotate(5deg) scale(0.9);
    }
    42% {
      transform: translateY(-7px) rotate(-12deg) scale(1.1);
    }
    100% {
      transform: translateY(0) rotate(0) scale(1);
    }
  }

  @keyframes shrink {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes fade-out-up {
    0% {
      opacity: 1;
      transform: translate(-50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -20px) scale(0.9);
    }
  }
}
</style>
