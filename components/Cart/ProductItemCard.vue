<template>
  <div class="cart-product-card" :class="{ active: props.valid, invalid: !props.valid }">
    <dl class="cart-list">
      <dt
        class="product-img"
        @click="emit('goDetail', productItem.spu.id)"
        :class="[props.valid ? '' : 'product-invalid', `product-${productStatus}`]">
        <Image v-if="props.valid" class="h-full w-full rounded-[4px]" :pic-url="productItem.spu.picUrl"></Image>
      </dt>
      <dd class="flex-1 pl-3">
        <el-tooltip :content="productItem.spu.name" placement="top">
          <h3
            class="mb-[30px] mt-[10px] max-w-[100px] truncate text-base font-medium leading-[22px]"
            @click="emit('goDetail', productItem.spu.id)">
            {{ productItem.spu.name }}
          </h3>
        </el-tooltip>
        <span class="text-[#666]">
          <span class="text-[10px] font-medium">￥</span>
          <span class="font-semibold">{{ productItem.spu.payPrice }}</span>
        </span>
      </dd>
      <dd class="basis-[114px] px-3">
        <el-select
          placeholder="请选择"
          :disabled="!valid"
          v-model="value"
          @change="emit('change', productItem.id, value)"
          :teleported="false"
          size="small"
          style="width: 100%">
          <el-option v-for="item in rightTypeOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </dd>
      <dd @click="handlerDelete" class="h-full border-l border-solid border-[#ebebed] px-[14px] flex-items-center">
        <icon-delete :style="{ width: '16px', height: '16px' }"></icon-delete>
      </dd>
    </dl>
  </div>
</template>
<script setup lang="ts">
const cartStore = useCartStore()
interface selectInterface {
  label: string
  value: number
}

interface CartProductItemProps {
  productItem: Product.CartProductInterface
  valid: boolean
}
const props = withDefaults(defineProps<CartProductItemProps>(), { valid: true })
// 版权类型
// const copyrightOptions = ref(COPYRIGHT_TYPE_ENUM.SELECT_OPTIONS)
// 版权类型
const value = ref(props.productItem.rightType)
watch(
  () => props.productItem.rightType,
  () => {
    value.value = props.productItem.rightType
  }
)
const rightTypeOptions = computed(() => {
  const list: selectInterface[] = []
  props.productItem.spu.rightTypeList.forEach((item) => {
    list.push({ label: COPYRIGHT_TYPE_ENUM.VALUE_LABEL[item], value: item })
  })
  return list
})
// const emit = defineEmits(["change", "goDetail", "deleteProduct"])
const productStatus = computed(() => {
  if (!props.productItem) return ""
  switch (props.productItem.status) {
    case PRODUCT_STATUS_ENUM.DELETED:
      return "deleted"
    case PRODUCT_STATUS_ENUM.DISABLE:
      return "removed"
    case PRODUCT_STATUS_ENUM.COPYRIGHT_ON_SALE:
      return "saling"
    case PRODUCT_STATUS_ENUM.COPYRIGHT_SALE_OUT:
      return "sold"
    default:
      return "able"
  }
})
interface FilterEmits {
  (e: "change", id: number, value: number): void
  (e: "goDetail", id: number): void
}
const emit = defineEmits<FilterEmits>()
const handlerDelete = () => {
  cartStore.delProduct(props.productItem.id)
}
</script>
<style lang="scss" scoped>
.cart-product-card {
  box-sizing: border-box;
  height: 105px;
  padding: 8px 0 8px 10px;
  cursor: pointer;
  background: rgb(218 218 218 / 12.9%);
  border-radius: 10px;
  box-shadow: 0 4px 4px 0 rgb(0 0 0 / 6%);
  &:hover {
    background: #f6f9ff;
    box-shadow: 0 4px 4px 0 rgb(171 202 255 / 40%);
  }
  &.invalid {
    color: #666666;
    .el-select {
      --el-select-disabled-color: #666666;
    }
  }
  dl.cart-list {
    display: flex;
    align-items: center;
    height: 100%;
    dd {
      flex-shrink: 0;
    }
    .product-img {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      width: 118px;
      height: 88px;
    }
    .product-invalid {
      height: 88px;
    }
    .product-deleted {
      background-image: url("/images/product-deleted.png");
    }
    .product-removed {
      background-image: url("/images/product-removed.png");
    }
    .product-saling {
      background-image: url("/images/product-saling.png");
    }
    .product-sold {
      background-image: url("/images/product-sold.png");
    }
  }
}
</style>
