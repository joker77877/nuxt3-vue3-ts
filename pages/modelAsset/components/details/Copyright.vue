<template>
  <div class="sell mb-8 leading-[22px] py-8 px-[30px] rounded border border-solid border-[#EBEBED]">
    <div class="mb-[28px] border-b border-solid border-[#ccc] font-medium text-[18px] text-[#666] flex justify-between">
      <span
        v-for="tab in copyrightTabs"
        :key="tab.id"
        class="pb-6 border-b-[2px] cursor-pointer border-solid mb-[-1px]"
        :class="[currentType === tab.id ? 'text-blue border-blue' : 'border-transparent']"
        @click="changeTabHandle(tab.id)">
        {{ tab.name }}
      </span>
    </div>
    <div class="copyright-content" v-if="currentTabInfo">
      <div class="has-buy mb20" v-if="buyState === ProductStatus.DOWNLOAD">
        <div class="price">
          <span>¥ {{ currentTabInfo.price }}</span>
        </div>
        <small>您已购买版权可以直接下载啦～</small>
      </div>
      <div class="price mb20" v-else>¥ {{ currentTabInfo.price }}</div>
      <div class="buy-group flx-align-center mb-6" v-if="buyState === ProductStatus.NORMAL">
        <el-tooltip :content="isSelf ? '您是当前版权拥有者，不可加入购物车' : ''" :disabled="!isSelf" placement="top">
          <el-button type="warning" size="large" :disabled="isSelf" v-debounce="addToCartHandle">
            <icon-cart-white class="base-icon mr12"></icon-cart-white>
            加入购物车
          </el-button>
        </el-tooltip>
        <!-- TODO 接口联调 -->
        <el-tooltip :content="isSelf ? '您是当前版权拥有者，不可购买' : ''" :disabled="!isSelf" placement="top">
          <el-button type="primary" size="large" :disabled="isSelf" v-debounce="buyNowHandle">
            <icon-card class="base-icon mr12"></icon-card>
            立即购买
          </el-button>
        </el-tooltip>
      </div>
      <!-- TODO 接口联调 -->
      <div class="buy-group flx-align-center mb-6" v-if="buyState === ProductStatus.PAYING">
        <el-button type="primary" class="flex-full" size="large" v-debounce="payHandle">
          <icon-pay class="base-icon mr12"></icon-pay>
          立即付款
        </el-button>
      </div>
      <div class="buy-group flx-align-center mb-6" v-if="buyState === ProductStatus.SELLING">
        <el-button :disabled="true" type="info" class="flex-full" size="large">
          <icon-load-hourglass class="base-icon mr12"></icon-load-hourglass>
          版权出售中
        </el-button>
      </div>
      <div class="buy-group flx-align-center mb-6" v-if="buyState === ProductStatus.DOWNLOAD">
        <el-button type="primary" class="flex-full" size="large" @click="downloadHandle">
          <icon-download class="base-icon mr12"></icon-download>
          立即下载
        </el-button>
      </div>
      <div class="title flx-align-center mb20">
        <icon-web class="base-icon mr6"></icon-web>
        <span v-if="currentType === ProductCopyRightType.NORMAL">个人授权范围</span>
        <span v-else-if="currentType === ProductCopyRightType.COMPANY">企业授权范围</span>
        <span v-else-if="currentType === ProductCopyRightType.COPYRIGHT">作品版权范围</span>
      </div>
      <div class="list" v-if="[ProductCopyRightType.NORMAL, ProductCopyRightType.COMPANY].includes(Number(currentType))">
        <div class="item">
          <icon-success class="base-icon success"></icon-success>
          <span>学习、教学、研究</span>
        </div>
        <div class="item">
          <icon-success class="base-icon success"></icon-success>
          <span>作为非核心内容的个人作品、毕业设计、参赛、演绎</span>
        </div>
        <div class="item">
          <icon-success class="base-icon success"></icon-success>
          <span>个人自媒体、视频、直播、教程</span>
        </div>
        <div class="item">
          <icon-success v-if="currentType === 2" class="base-icon success"></icon-success>
          <icon-close v-else class="base-icon error"></icon-close>
          <span>企业自媒体、短视频、直播、培训、课程等</span>
        </div>
        <div class="item">
          <svg-icon
            class="base-icon"
            :class="[currentType === 2 ? 'success' : 'error']"
            :name="currentType === 2 ? 'success' : 'close'"></svg-icon>
          <span>企业广告、宣传的展示</span>
        </div>
        <div class="item">
          <svg-icon
            class="base-icon"
            :class="[currentType === 2 ? 'success' : 'error']"
            :name="currentType === 2 ? 'success' : 'close'"></svg-icon>
          <span>赛事、会议、演出、展会等</span>
        </div>
      </div>
      <div class="scope-of-copyright" v-if="currentType === ProductCopyRightType.COPYRIGHT">
        <p>版权, 也被称为著作权，主要包括人身权和财产权两部分。</p>
        <p>
          人身权主要关注作者与其作品的联系，包括以下权利:发表权:作者有权决定是否将其作品公之于众，包括出版、公演、广播电台电视台播放等方式。
        </p>
        <p>善名权:作者有权决定是否在作品中表明自己的身份并再名。</p>
        <p>修改权:作者有权修改自己的作品，也有权授权他人修改自己的作品。</p>
        <p>保护作品完整权:作者有权保护其作品不被歪曲、篡改，维护作品的完整性。</p>
        <p>财产权则涉及作品的经济利益，包括如下权利:</p>
        <p>复制权:通过印刷、复印、录音、录像、翻拍等方式制作作品的一份或多份。</p>
        <p>发行权:以出售或赠与的方式向公众提供作品的原件或复制件。</p>
        <p>出租权:许可他人临时使用作品，如出租图书、音像制品等。</p>
        <p>展览权:向公众展示作品的原件或复制件。</p>
        <p>
          表演权:公开表演作品，或以各种方式公开播放作品放映权:通过放映机、幻灯机等技术设备公开再现美术、摄影、电影和以类似摄制电影的方法创作的作品等。
        </p>
        <p>广插权:以无线方式公开广播或传播作品，或以有线传播或转播的方式向公众传播广播的作品。</p>
        <p>信息网络传播权:以有线或无线方式向公众提供作品使公众可以在其个人选定的时间和地点获得作品。</p>
        <p>摄制权:将作品固定在酸体上，如将小说改编为电影或电视剧</p>
        <p>改编权:改变作品，创作出具有独创性的新作品。</p>
        <p>翻译权:将作品从一种语言文字转换成另一种语言文子。</p>
        <p>汇编权:将作品或作品片段通过选择或编排，汇集成作品。</p>
        <p>
          使用权则更侧重于作品的具体使用方式，通常包括复制、发行、出租、展览、放映、广播、网络传播、拍摄、改编、翻译、编辑等权利。这些权利允许作品在定条件下被他人使用，以满足社会文化和经济需求。
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { checkIsLogin } = useCheckIsLogin()

interface Props {
  copyrightTabs: CopyrightTabItem[]
  copyrightType: Number
  productId: string
  isSelf: boolean
}
const { copyrightTabs, copyrightType, productId, isSelf } = defineProps<Props>()
const authStore = useAuthStore()
const emit = defineEmits(["showDownload", "addCart", "buyAction", "payAction"])
const currentType = ref(copyrightType)
const currentTabInfo = computed(() => copyrightTabs.find((tab) => tab.id === currentType.value))
const buyState = ref(ProductStatus.NORMAL)
const orderId = ref()
const payId = ref()

// 加入购物车
const addToCartHandle = async () => {
  try {
    if (!checkIsLogin()) return
    // TODO 执行加入购物车
    emit("addCart", currentType.value)
  } catch (err) {
    console.log("addToCartHandle", err)
  }
}

// 立即购买
const buyNowHandle = async () => {
  try {
    if (!checkIsLogin()) return
    // TODO 执行立即购买
    emit("buyAction", currentType.value)
  } catch (err) {
    console.log("buyNowHandle", err)
  }
}
const payHandle = async () => {
  emit("payAction", orderId.value, payId.value, currentType.value)
}

// 获取购买状态
const getProductBuyStateHandle = async () => {
  try {
    if (!authStore.accessToken) return
    const data = await getProductBuyState({
      spuId: productId,
      saleMode: Number(currentType.value)
    })

    buyState.value = (data as any).state
    const resultOrderId = (data as any).orderId
    payId.value = data.payId
    if (resultOrderId) {
      orderId.value = resultOrderId
    }
  } catch (err) {
    console.log("获取购买状态错误", err)
  }
}

const downloadHandle = () => {
  emit("showDownload", orderId.value)
}

// 登录状态刷新后，刷新详情数据
$bus.on("refreshData", () => {
  // 获取购买状态
  getProductBuyStateHandle()
})

onMounted(() => {
  // 获取购买状态
  getProductBuyStateHandle()
})

const changeTabHandle = (type: number) => {
  currentType.value = type
  getProductBuyStateHandle()
}
</script>
<style lang="scss" scoped>
.sell {
  .copyright-content {
    .has-buy {
      .price {
        text-decoration: line-through;
      }
      small {
        font-size: var(--el-font-size-extra-small);
        font-weight: 400;
        color: var(--el-color-info-light-3);
      }
    }
    .price {
      font-family: Inter;
      font-size: 32px;
      font-weight: 600;
      line-height: 38px;
      color: var(--el-color-danger);
    }
    .buy-group {
      gap: 12px;
      justify-content: space-between;
      font-size: 16px;
      .el-button {
        width: 190px;
        height: 49px;
      }
    }
    .title {
      .base-icon {
        font-size: 16px;
      }
      span {
        font-size: var(--el-font-size-large);
        font-weight: 400;
        line-height: 22px;
        color: var(--el-text-color-regular);
      }
    }
    .list {
      .item {
        display: flex;
        gap: 6px;
        align-items: center;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        .success {
          color: $primary-color;
        }
        .error {
          color: var(--el-text-color-regular);
        }
        .el-icon {
          font-size: 18px;
        }
        span {
          font-size: var(--el-font-size-base);
          font-weight: 400;
          line-height: 22px;
          color: var(--el-text-color-regular);
        }
      }
    }
    .scope-of-copyright p {
      font-size: var(--el-font-size-base);
      font-weight: 400;
      line-height: 24px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
