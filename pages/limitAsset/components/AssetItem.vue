<template>
  <div
    class="overflow-hidden bg-white shadow-[0px_4px_20px_-4px_#10182814]"
    :class="[props.layout === 'compact' ? 'rounded' : 'p-[30px] rounded-lg']">
    <div
      class="relative before:block before:content-['']"
      :class="[props.layout === 'compact' ? 'before:pt-[67.57%]' : 'before:pt-[64.72%]']">
      <div @click="goDetail" class="absolute inset-0 cursor-pointer">
        <Image
          class="h-full w-full overflow-hidden"
          :class="[props.layout === 'compact' ? '' : 'rounded-[4px]']"
          :pic-url="product.picUrl"></Image>
      </div>
      <!-- 左上角限量 -->
      <div v-if="props.limitPos === 'lt'" class="absolute left-[-3px] top-[15px] text-white">
        <icon-ribbon :style="{ width: '116px', height: 'auto' }"></icon-ribbon>
        <div class="absolute inset-0 pr-2 pt-[6px] text-center">
          <div class="pb-1 text-xs font-medium">限量</div>
          <div class="text-base font-black text-[#FFDDCC] leading-[20px]">{{ product.stock }}份</div>
        </div>
      </div>
      <!-- 右上角排名 -->
      <div
        v-if="isNumber(props.rank)"
        class="absolute right-[5px] top-[5px] h-[60px] w-[60px] rounded bg-[rgba(35,40,51,0.5)] flex-center">
        <icon-rank-one v-if="props.rank === 1" :style="{ width: '35px', height: '32px' }"></icon-rank-one>
        <icon-rank-two v-if="props.rank === 2" :style="{ width: '35px', height: '32px' }"></icon-rank-two>
        <icon-rank-three v-if="props.rank === 3" :style="{ width: '35px', height: '32px' }"></icon-rank-three>
      </div>
    </div>
    <div :class="[props.layout === 'compact' ? 'px-3 pb-[18px] pt-3' : '']">
      <div
        class="mb-[10px] flex justify-between"
        :class="[props.layout === 'compact' ? 'leading-[22px] font-medium' : 'mt-[30px] leading-[28px]']">
        <span
          @click="goDetail"
          class="flex-1 cursor-pointer truncate"
          :class="[props.layout === 'compact' ? 'text-[14px]' : 'text-[20px]']">
          {{ product.name }}
        </span>
        <span class="text-[16px] mita-text-red" :class="[props.layout === 'compact' ? ' ' : 'font-bold']">
          <span class="mr-1">￥</span>
          <span>{{ product.price }}</span>
        </span>
      </div>
      <div class="flex items-center justify-between">
        <div
          class="flex overflow-hidden rounded text-xs"
          :class="[props.layout === 'compact' ? 'leading-[21px]' : 'leading-[26px]']"
          v-if="props.limitPos === 'lb'">
          <span
            class="limit-tag-gradient text-[rgba(35,40,51,0.85)]"
            :class="[props.layout === 'compact' ? 'px-[6px] font-medium' : 'px-[12px]']">
            限量
          </span>
          <span class="bg-[#232833]" :class="[props.layout === 'compact' ? 'px-[6px]' : 'px-[8px]']">
            <span class="limit-text-gradient">
              {{ product.stock }}
            </span>
          </span>
        </div>
        <div
          class="flex text-xs text-[rgba(35,40,51,0.5)]"
          :class="[props.layout === 'compact' ? 'leading-[16px]' : 'leading-[25px]']">
          <icon-eye2 :style="iconSize"></icon-eye2>
          <span class="ml-1">{{ product.browseCount }}</span>
          <!-- <icon-like class="ml-[10px]" :style="iconSize"></icon-like>
          <span class="ml-1">{{ product.browseCount }}</span> -->
          <icon-collect2 class="ml-[10px]" :style="iconSize"></icon-collect2>
          <span class="ml-1">{{ product.collectionCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    product: Product.ProductItem
    // 限量数量位置：左上、左下
    limitPos?: "lt" | "lb"
    // 布局类型
    layout?: "compact" | "loose"
    rank?: number
  }>(),
  {
    limitPos: "lb",
    layout: "loose"
  }
)

const iconSize = props.layout === "compact" ? { width: "16px", height: "16px" } : { width: "25px", height: "25px" }

const goDetail = () => {
  window.open(`/limit-asset/${props.product.id}`, "_blank")
}
</script>
