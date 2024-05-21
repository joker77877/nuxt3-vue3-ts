<template>
  <el-col :span="9">
    <div class="flex-items-center">
      <Image
        @click="onJumpDetail(v.spuId, v.spuType)"
        :pic-url="v.picUrl"
        class="mr-3 h-[120px] w-[136px] flex-shrink-0 cursor-pointer rounded-md"
        alt="pic"></Image>
      <div class="flex-1 py-8 pr-2 mita-text-regular">
        <el-tooltip :content="v.spuName" placement="top">
          <p @click="onJumpDetail(v.spuId, v.spuType)" class="mb-4 w-fit max-w-[200px] cursor-pointer text-hidden">
            {{ v.spuName }}
          </p>
        </el-tooltip>
        <el-tooltip :content="v.author" placement="top">
          <p class="w-fit max-w-[200px] text-sm text-hidden">作者：{{ v.author }}</p>
        </el-tooltip>
      </div>
    </div>
  </el-col>
  <el-col :span="3">
    <div class="h-full py-8">
      <p class="mb-4 mita-text-red">￥{{ v.originalPrice }}</p>
      <el-tag type="info" effect="plain">{{ RightTypeMap[v.rightType].label }}</el-tag>
    </div>
  </el-col>
  <el-col :span="3">
    <p class="h-full py-8 flex-items-center mita-text-regular">{{ OrderStatusEnum.VALUE_LABEL[e.status] }}</p>
  </el-col>
  <el-col :span="2">
    <div class="h-full py-8 flex-items-center">
      <p class="mita-text-red">￥{{ v.payPrice }}</p>
    </div>
  </el-col>
</template>
<script lang="ts" setup>
const { e, v } = defineProps<{ e: GetOrderList.List; v: GetOrderList.Item }>()

const onJumpDetail = (id: number, spuType: number) => {
  if (spuType !== AssetTypeEnum.LIMITED) {
    navigateTo(`/asset/${id}`)
  } else {
    navigateTo(`/limit-asset/${id}`)
  }
}
</script>
