<!--
 * @Author: joker77877 joker7778777@163.com
 * @Date: 2024-04-03 14:17:12
 * @LastEditors: joker77877 joker7778777@163.com
 * @LastEditTime: 2024-05-21 09:38:17
 * @FilePath: \meta3d-fontend\src\views\uploadWork\components\AddUploadWork.vue
 * @Description: 添加作品页面
-->

<template>
  <div class="add-upload min-h-screen overflow-auto bg-[#F5F5F5] pt-[100px] flex-col-items-center">
    <div class="cursor-pointer flex-col-items-center" @click="onJumpHome">
      <img src="/images/logo.png" alt="Mita3D" />
      <p class="mt-10 text-center text-xl font-semibold leading-[22px]">
        <span class="mr8" v-if="isLimited">
          创作
          <span class="text-blue">限量藏品</span>
        </span>
        <span>全球</span>
        <span class="text-blue">最大</span>
        <span>的3d资产交易平台</span>
      </p>
    </div>
    <div class="upload-box mt-[68px] h-[378px] w-[492px] rounded-3.5xl bg-white p-5">
      <a-upload
        :file-list="fileList"
        :show-upload-list="false"
        class="upload-file block h-full w-full"
        :max-count="1"
        accept=".zip,.rar,.7z,.glb,.gitf"
        @change="onFileChange"
        :before-upload="() => false">
        <div
          class="h-full w-full cursor-pointer rounded-3.5xl border border-dashed border-[#AEB4AF33] px-[50px] py-[60px] flex-col-center">
          <template v-if="fileList.length">
            <span v-for="file of fileList" :key="file.uid" class="text-center text-el-text-color break-all text-2xl">
              {{ file.name }}
            </span>
          </template>
          <template v-else>
            <div>
              <icon-upload></icon-upload>
            </div>
            <span class="font-500-18 pb-11 pt-6">上传新模型</span>
            <span class="font-500-14 text-center">我们支持glb、gitf.您还可以上传zip.rar,7z格式的压缩包最大上传限制100M</span>
          </template>
        </div>
      </a-upload>
    </div>
    <a-space class="w-[362px] pt-9" :size="16" direction="vertical">
      <a-button block type="primary" size="large" class="text-base" :disabled="!fileList.length" @click="onNextStep">
        确定
      </a-button>
      <a-button type="link" size="large" block class="text-base" text @click="onGoback">取消</a-button>
    </a-space>
  </div>
</template>
<script setup lang="ts">
// 是否限量资产
const { isLimited } = defineProps({
  isLimited: Boolean
})
const { onFileChange, fileList } = useUploadWork(isLimited)
/* ref */
const router = useRouter()

const onNextStep = () => {
  if (isLimited) {
    router.push(`${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}`)
  } else {
    // uploadWorkStore.step = 2
    router.push(INDEX_ROUTE.WORKS)
  }
}

const onGoback = () => {
  router.back()
  clearUploadWorkStore()
}
const onJumpHome = () => {
  navigateTo("/")
  clearUploadWorkStore()
}
</script>
<style scoped lang="postcss">
.upload-box {
  box-shadow: 0 8px 8px -4px rgb(16 24 40 / 8%);
}
.upload-file {
  :deep(.ant-upload) {
    @apply h-full w-full;
  }
}
</style>
