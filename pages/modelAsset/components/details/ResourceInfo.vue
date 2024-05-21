<template>
  <div
    class="mb-8 leading-[22px] pt-10 pb-2 px-[30px] rounded border border-solid border-[#EBEBED]"
    v-bind="$attrs"
    v-if="resourceInfo">
    <div class="pb-6 font-medium text-[18px] border-b-[#EBEBED] border-b border-solid mb-5">模式格式详情</div>
    <div class="flex mb-6 justify-between">
      <span>作品编号</span>
      <span class="font-medium">{{ resourceInfo.id }}</span>
    </div>
    <div class="flex mb-6 justify-between" v-for="item in resourceInfo.formatDetailList" :key="item.keyName">
      <span>{{ item.keyName }}</span>
      <span class="font-medium">{{ item.keyValue }}{{ item.keyName === "下载大小" ? "MB" : "" }}</span>
    </div>
  </div>
  <!-- <el-skeleton :loading="!resourceInfo" animated :throttle="500">
    <template #template>
      <div class="format-info border-box mb33">
        <el-skeleton-item class="title border-btm pb25 mb20 w50" variant="p"></el-skeleton-item>
        <div>
          <el-skeleton-item class="mb15" variant="text"></el-skeleton-item>
          <el-skeleton-item class="mb15" variant="text"></el-skeleton-item>
          <el-skeleton-item class="mb15" variant="text"></el-skeleton-item>
        </div>
      </div>
    </template>
  </el-skeleton> -->
</template>
<script setup lang="ts">
interface Props {
  id: string
}
const { id } = defineProps<Props>()

const resourceInfo = ref()

// 获取模式格式详情
const getProductResourceInfoHandle = async () => {
  const data = await getProductResourceInfo(id)
  const newFormatDetailList = (data as any).formatDetailList.map((item: any) => {
    const val = item.keyValue
    item.keyValue = val.indexOf("[") > -1 ? JSON.parse(val).join("、") : val
    return item
  })
  resourceInfo.value = { ...data, formatDetailList: newFormatDetailList }
}
onMounted(() => {
  // 获取模式格式详情
  getProductResourceInfoHandle()
})
</script>
