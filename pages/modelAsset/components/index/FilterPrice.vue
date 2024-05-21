<template>
  <div class="price-filter-wrapper" ref="priceFilterRef">
    <div class="val-box flx-justify-between" @click="triggerPriceFilter">
      <span class="title">价格</span>
      <el-icon class="arrow-icon" :class="[showContent ? 'arrow-up' : 'arrow-down']"><ElIconArrowDown></ElIconArrowDown></el-icon>
    </div>
    <div class="down-cont-wrapper" v-if="showContent" :class="[showContent ? 'height-full' : 'height-empty']">
      <div class="type-group border-btm pb3 mb18">
        <el-radio-group v-model="filterPriceValue.type" @change="priceTypeChangedHandle">
          <el-radio v-for="(item, index) in priceTypeOptions" :key="index" :value="item.value" size="large">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="price-range border-btm pb12 mb18">
        <span class="cunstom-price-title mb12">自定义价格</span>
        <div class="mb18 flx-justify-between">
          <el-input
            size="small"
            :formatter="formatInput"
            style="width: 80px"
            placeholder="最低价"
            v-model="startPrice"></el-input>
          -
          <el-input
            size="small"
            :formatter="formatInput"
            style="width: 80px"
            placeholder="最高价"
            @blur="checkEndPrice"
            v-model="endPrice"></el-input>
        </div>
        <el-button size="large" type="primary" class="submit-btn" @click="priceChangedHandle">确定</el-button>
      </div>
      <div class="price-sort">
        <el-button text link class="mb18" @click="sortByPrice(false)">价格从低到高</el-button>
        <el-button text link @click="sortByPrice(true)">价格从高到低</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface FilterPriceProps {
  defaultPrice: FilterPriceInterface
}

const props = withDefaults(defineProps<FilterPriceProps>(), {})
const priceFilterRef = ref()
const filterPriceValue = ref(props.defaultPrice)
const priceTypeOptions = ref(FILTER_COPYRIGHT_ENUM.SELECT_OPTIONS)

const emit = defineEmits(["change"])

const showContent = ref(false)
const startPrice = ref()
const endPrice = ref()

const priceTypeChangedHandle = (type: any) => {
  const typeVal = type + 6
  filterPriceValue.value.sortAsc = true
  emit("change", typeVal)
}

const priceChangedHandle = () => {
  if (!filterPriceValue.value.type) {
    filterPriceValue.value.type = 0
  }
  filterPriceValue.value.startPrice = startPrice.value
  filterPriceValue.value.endPrice = endPrice.value
  showContent.value = false
  document.body.removeEventListener("click", closePriceFilter, false)
  const typeVal = filterPriceValue.value.type + 6
  emit("change", typeVal)
}

/**
 * 按价格进行排序
 * @param isAsc 是否为升序
 */
const sortByPrice = (isDesc: boolean) => {
  filterPriceValue.value.sortAsc = isDesc
  if (!filterPriceValue.value.type) {
    filterPriceValue.value.type = 0
  }
  const typeVal = filterPriceValue.value.type + 6
  emit("change", typeVal)
}

const triggerPriceFilter = () => {
  showContent.value = !showContent.value
  nextTick(() => {
    if (showContent.value) {
      document.body.addEventListener("click", closePriceFilter, false)
    } else {
      document.body.removeEventListener("click", closePriceFilter, false)
    }
  })
}

const closePriceFilter = (e: Event) => {
  if (priceFilterRef.value && !priceFilterRef.value.contains(e?.target)) {
    showContent.value = false
    document.body.removeEventListener("click", closePriceFilter, false)
  }
}

const formatInput = (value: string) => {
  // 格式化输入的值，保留数字部分
  return value.replace(/^0+(\d)|[^\d]+/g, "")
}

const checkEndPrice = () => {
  if (endPrice.value < startPrice.value) {
    endPrice.value = startPrice.value
    message.error("最高价不能低于最低价")
  }
}

const resetValue = () => {
  delete filterPriceValue.value.type
  filterPriceValue.value.startPrice = null
  filterPriceValue.value.endPrice = null
  filterPriceValue.value.sortAsc = true
  startPrice.value = null
  endPrice.value = null
}

// 暴露给父组件使用
defineExpose({ closePriceFilter, filterPriceValue: filterPriceValue.value, resetValue })
</script>
<style lang="scss" scoped>
.price-filter-wrapper {
  position: relative;
  .val-box {
    width: 100px;
    height: 24px;
    padding-right: 8px;
    padding-left: 8px;
    line-height: 24px;
    cursor: pointer;
    background-color: var(--el-fill-color-blank);
    border-radius: var(--el-border-radius-base);
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
    transition: var(--el-transition-duration);
    .arrow-icon {
      font-size: var(--el-font-size-base);
      color: #abb7cc;
      &.arrow-down {
        transition: 0.8s;
        transform: rotateZ(0deg);
        transform-origin: center center;
      }
      &.arrow-up {
        transition: 0.8s;
        transform: rotateZ(180deg);
        transform-origin: center center;
      }
    }
    .title {
      font-size: var(--el-font-size-extra-small);
    }
  }
  .down-cont-wrapper {
    position: absolute;
    top: 37px;
    left: 50%;
    z-index: 10;
    width: 225px;
    padding: 20px 15px;
    background: #ffffff;
    border: 1px solid #ebebed;
    border-radius: 4px;
    box-shadow: 0 0 12px rgb(0 0 0 / 12%);
    transition: height 0.8s ease;
    transform: translateX(-50%);
    &.height-full {
      height: 386px;
    }
    &.height-empty {
      height: 0;
    }
    &::after {
      position: absolute;
      top: -13px;
      left: 50%;
      z-index: 2;
      width: 0;
      height: 0;
      content: "";
      border: 6px solid transparent;
      border-bottom-color: #ebebed;
      transform: translateX(-50%);
    }
    &::before {
      position: absolute;
      top: -12px;
      left: 50%;
      z-index: 3;
      width: 0;
      height: 0;
      content: "";
      border: 6px solid transparent;
      border-bottom-color: #ffffff;
      transform: translateX(-50%);
    }
    .el-radio-group {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      .el-radio {
        width: 100%;
        padding-left: 4px;
        margin-right: 0;
        font-size: var(--el-font-size-extra-small);
        font-weight: 400;
        color: #999999;
        &:hover {
          background-color: rgb(204 204 204 / 20%);
        }
      }
    }
    .cunstom-price-title {
      display: block;
      font-size: var(--el-font-size-extra-small);
      font-weight: 400;
      line-height: 22px;
      color: var(--el-text-color-regular);
    }
    .submit-btn {
      width: 100%;
    }
    .price-sort {
      .el-button.is-text {
        display: block;
        height: 22px;
        margin: 0;
        font-size: var(--el-font-size-extra-small);
        font-weight: 400;
        line-height: 22px;
        color: #999999;
      }
    }
  }
}
</style>
