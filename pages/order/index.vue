<template>
  <div class="order-wrap">
    <div class="fixed-width">
      <section class="product-wrap bg-white">
        <el-table :data="list" style="width: 100%" header-row-class-name="order-table-header" row-class-name="order-table-row">
          <el-table-column prop="id" label="作品信息">
            <template #default="scope"><product-item :product-item="scope.row"></product-item></template>
          </el-table-column>
          <el-table-column prop="rightType" label="出售类型">
            <template #default="scope">
              <span class="ftw500" v-if="isLimited">限量资产</span>
              <span class="ftw500" v-else>{{ copyrightLabel[scope.row.rightType] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payPrice" label="金额">
            <template #default="scope">
              <span class="ft20 danger-color">{{ scope.row.payPrice }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="operation-more" v-if="isShowMore">
          <el-button type="primary" class="w-[112px]" size="large" @click="handlerToggle">
            {{ isCollapse ? "查看更多" : "收起" }}
          </el-button>
        </div>
      </section>
      <section class="pay-wrap bg-white">
        <h2 class="title-2">请选择支付方式</h2>
        <ul class="pay-list">
          <li v-for="item in payWayOptions" :key="item.label">
            <pay-item
              :pay-type="item.value"
              :selected="item.selected"
              v-if="item.value === payWay.WALLET"
              @click="handlePayWay(item.value)">
              <span>账户余额：￥{{ balance }}</span>
              <!-- <u-tag class="ml15" :value="item.label"></u-tag> -->
            </pay-item>
            <pay-item v-else :pay-type="item.value" :selected="item.selected" @click="handlePayWay(item.value)">
              {{ item.label }}
            </pay-item>
          </li>
        </ul>
        <div class="product-pay">
          <div class="pt36">
            <span style="margin-right: 134px">作品金额:</span>
            <span class="info-color">￥{{ orderData?.totalPrice }}</span>
          </div>
          <div class="pt20">
            <span class="ft18" style="margin-right: 99px">应付金额:</span>
            <span class="ft20 danger-color">￥{{ orderData?.payPrice }}</span>
          </div>
          <div class="pt24">
            <el-button type="primary" @click="handlerSubmitPay" :loading="loading" style="width: 260px; height: 50px">
              确定支付
            </el-button>
          </div>
          <div class="pt38 agree-wrap">
            <!-- <el-radio v-model="isAgree" style="margin-right: 0"></el-radio> -->
            <el-checkbox v-model="isAgree">
              <div class="leading-[22px]">
                <span class="mr-1 text-[#232833]">我已同意并阅读</span>
                <el-link class="align-top" type="primary">《觅她网 买家协议》</el-link>
              </div>
            </el-checkbox>
          </div>
        </div>
      </section>
    </div>
  </div>
  <el-dialog v-model="aliQCodeVisible" width="1200">
    <iframe
      :srcdoc="aliQCode"
      frameborder="0"
      border="0"
      marginheight="0"
      marginwidth="0"
      scrolling="no"
      style="overflow: hidden"
      width="1100px"
      height="800px"
      title="支付宝支付"></iframe>
  </el-dialog>
</template>

<script setup lang="ts">
// 是否限量资产
const { isLimited } = defineProps({
  isLimited: Boolean
})
const route = useRoute()

let timer: NodeJS.Timeout | number

const id = ref()
const payOrderId = ref()
const orderData = ref<Product.ResOrderDetail>()
// 是否同意支付协议
const isAgree = ref(0)
const copyrightLabel = reactive(COPYRIGHT_TYPE_ENUM.VALUE_LABEL)
const payWay = reactive(PAY_WAYS_ENUM)
// 支付方式
const payWayOptions = ref()
// 当前选择的支付渠道
const payChannel = ref()
// 余额
const balance = ref()
// 大于3个作品显示查看更多
const isShowMore = computed(() => {
  if (orderData.value?.items.length) {
    return orderData.value?.items.length > 3
  }
  return false
})
// 是否折叠
const isCollapse = ref(true)
// 要展示的订单列表
const list = computed(() => {
  if (isShowMore) {
    return isCollapse.value ? orderData.value?.items.slice(0, 3) : orderData.value?.items
  }
  return orderData.value?.items
})

const init = () => {
  id.value = route.query.id
  payOrderId.value = route.query.pid
}
const loadData = async () => {
  const data = await getOrderDetail(id.value)
  // 当数据为空时返回，代表没有权限或者此订单不存在
  if (!data) {
    navigateTo("/404")
  }
  orderData.value = data
}
// 加载零钱
const loadBalance = async () => {
  const data = await getBalance()
  balance.value = data.balance
}
// 加载支付方式
const loadPayChannel = async () => {
  const data = await getEnablePay()
  // 默认选择第一种支付方式
  if (data.length) {
    data[0].selected = true
    payChannel.value = data[0].value
  }
  payWayOptions.value = data
}
// 点击选择当前的支付方式
const handlePayWay = (value: string | number | boolean) => {
  payWayOptions.value.forEach((item: any) => {
    item.selected = false
    if (item.value === value) {
      item.selected = true
    }
  })
  payChannel.value = value
}
const goSuccessPage = () => {
  if (!isLimited) {
    // 只有一个资产的时候，在成功页下载否则跳到个人中心下载
    if (orderData.value?.items.length === 1) {
      navigateTo({ path: `/order/success`, query: { id: orderData.value.items[0].spuId, orderId: id.value } })
    } else {
      navigateTo({ path: `/order/success`, query: { orderId: id.value } })
    }
  } else {
    navigateTo({ path: `/order/success`, query: { orderId: id.value, from: AssetTypeEnum.LIMITED } })
  }
}
// 处理钱包支付
const handlerWalletPay = () => {
  goSuccessPage()
}
// 轮询支付状态
const loopPayStatus = () => {
  timer = setInterval(async () => {
    const res = await getPayStatus(id.value)
    if (res.status === PAY_ORDER_STATUS_ENUM.SUCCESS) {
      clearInterval(timer)
      goSuccessPage()
    }
  }, 5000)
}
// 处理支付宝支付
const aliQCodeVisible = ref(false)
const aliQCode = ref()
const handlerAliPay = (res: Product.ResSubmitOrder) => {
  aliQCodeVisible.value = true
  aliQCode.value = res.displayContent
  loopPayStatus()
}
const loading = ref(false)
const handlerSubmitPay = async () => {
  if (!isAgree.value) {
    message.warning("请先阅读【觅她网 买家协议】并勾选是否同意")
    return
  }
  loading.value = true
  try {
    const res = await submitOrder({
      id: payOrderId.value,
      channelCode: payChannel.value,
      spuType: isLimited ? AssetTypeEnum.LIMITED : AssetTypeEnum.NORMAL,
      returnUrl: `${window.location.origin}/order/success?orderId=${id.value}&from=${isLimited ? AssetTypeEnum.LIMITED : AssetTypeEnum.NORMAL}`
    })
    if (payChannel.value === payWay.WALLET) {
      // 如果是个人钱包支付
      handlerWalletPay()
    } else if (payChannel.value === payWay.ALIPAY_PC) {
      // 支付宝pc端支付
      handlerAliPay(res)
    }
  } catch (error) {
    loading.value = false
  }
}
const handlerToggle = () => {
  isCollapse.value = !isCollapse.value
}

onMounted(() => {
  init()
  loadPayChannel()
  loadData()
  loadBalance()
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<style lang="scss" scoped>
:deep(.order-table-header) {
  th {
    font-size: var(--el-font-size-extra-large);
    font-weight: 400;
    color: var(--el-text-color-regular);
  }
  .el-table__cell {
    padding: 30px 0 !important;
  }
}
:deep(.order-table-row) {
  .el-table__cell {
    padding: 24px 0 !important;
    border-bottom: 1px solid #cccccc;
  }
}
.order-wrap {
  min-height: calc(100vh - 155px);
  padding: 40px;
  background-color: $bg-color-grey;
  .product-wrap {
    padding: 10px 30px 40px 76px;
    border-radius: 14px;
  }
  .pay-wrap {
    padding: 42px 29px 118px 77px;
    margin-top: 40px;
    border-radius: 14px;
    .pay-list {
      display: flex;
      padding: 42px 0 47px;
      border-bottom: 1px solid $divided-color;
      li {
        margin-right: 42px;
      }
    }
    .product-pay {
      .agree-wrap {
        display: flex;
        align-items: center;
      }
    }
  }
  .operation-more {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
