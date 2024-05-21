<template>
  <el-popover popper-class="cart-popover" placement="top" ref="popoverRef" :width="450" :visible="showPopover">
    <template #reference>
      <cart-icon :count="cartStore.countGet" @click="handlerOpenCart" v-click-outside="onClickOutside"></cart-icon>
    </template>
    <div class="cart-main-wrap">
      <div class="cart-header">
        <h2 class="title-2">购物车</h2>
        <div class="operation">
          <el-popconfirm
            title="确定要清空购物车内容吗"
            popper-class="delete-sure-popconfirm"
            cancel-button-type="default"
            :teleported="false"
            :hide-icon="true"
            width="280"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handlerClearAll">
            <template #reference>
              <el-button class="border-[#232833]" round size="small" :disabled="!count">清除所有</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <div class="cart-main" v-if="count">
        <ul>
          <li class="mt20" v-for="item in validList" :key="item.id">
            <product-item-card
              :valid="true"
              :product-item="item"
              @change="updateCopyRight"
              @go-detail="goDetail"></product-item-card>
          </li>
          <li class="mt20" v-for="item in invalidList" :key="item.id">
            <product-item-card :valid="false" :product-item="item"></product-item-card>
          </li>
        </ul>
      </div>
      <cart-empty v-else></cart-empty>
      <div class="cart-footer">
        <div class="flex items-end justify-between pb-5 leading-none" v-if="count">
          <span class="text-[18px]">共计</span>
          <span class="danger-color">
            <span class="text-[20px]">￥</span>
            <span class="text-[24px]">{{ totalPrice }}</span>
          </span>
        </div>
        <div class="operation">
          <el-button
            v-if="count"
            :loading="loading"
            :disabled="!validList.length"
            @click="handlerGoPay"
            type="primary"
            style="width: 100%; height: 48px">
            立即付款
          </el-button>
          <el-button v-else type="primary" @click="goAssetIndex" style="width: 100%; height: 48px">去逛逛</el-button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ClickOutside as vClickOutside } from "element-plus"

const cartStore = useCartStore()
const showPopover = ref(false)
const popoverRef = ref()
const loading = ref(false)

const validList = computed(() => {
  return cartStore.validList || []
})
const invalidList = computed(() => {
  return cartStore.invalidList || []
})
const totalPrice = computed(() => {
  return cartStore.totalPrice
})
const count = computed(() => {
  return cartStore.countGet
})

// 点击外部时关闭弹窗
const onClickOutside = (e: any) => {
  if (showPopover.value && !unref(popoverRef).popperRef.contentRef.contains(e.target)) {
    showPopover.value = false
  }
}
// 清除购物车
const handlerClearAll = async () => {
  await cartStore.clearCart()
  // refresh()
}
// 去支付
const handlerGoPay = async () => {
  try {
    loading.value = true

    const req = cartStore.validList.map((item: Product.CartProductInterface) => ({
      count: item.count || 1,
      cartId: item.id,
      rightType: item.rightType
    }))
    const data = await createOrder({ items: req })
    if (data.existInvalidSpu) {
      ElMessageBox.alert("购物车中存在失效的作品，请确认", "提示", {
        confirmButtonText: "确定",
        callback: () => {
          cartStore.getCartDetail()
        }
      })
    } else {
      cartStore.getCartDetail()
      showPopover.value = false
      navigateTo(`/order/list?id=${data.id}&pid=${data.payOrderId}`)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}
const updateCopyRight = async (cartId: number, value: number) => {
  cartStore.updateCopyRight(cartId, value)
}
// const delProduct = async (id: number) => {
//   await cartStore.delProduct(id)
// }
const goDetail = (id: number) => {
  showPopover.value = false
  // router.push(`/asset/${id}`)
  window.open(`/asset/${id}`, "_blank")
}
const goAssetIndex = () => {
  showPopover.value = false
  navigateTo(`/asset`)
}
const handlerOpenCart = () => {
  cartStore.getCartDetail()
  showPopover.value = !showPopover.value
}
</script>
<style lang="scss" scoped>
.cart-main-wrap {
  .cart-header {
    display: flex;
    justify-content: space-between;
    padding: 40px 20px 8px;
    overflow: hidden;
    border-bottom: 1px solid var(--el-border-color);
    .operation {
      float: right;
    }
  }
  .cart-main {
    min-height: 300px;
    max-height: calc(100vh - 355px);
    padding: 0 20px 20px;
    overflow-y: auto;
  }
  .cart-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 140px;
    padding: 0 20px;
    margin-top: 5px;
    box-shadow: -1px -4px 8.2px rgb(114 165 255 / 10%);
  }
}
</style>
