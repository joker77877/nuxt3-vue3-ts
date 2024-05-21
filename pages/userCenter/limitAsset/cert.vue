<template>
  <div class="wrap">
    <!-- <a-dialog v-bind="$attrs" width="615" align-center>
      <div class="flex flex-col items-center">
        <div ref="certDOM" class="cert relative">
          <nuxt-image class="block" src="/images/asset_cert_bg.jpg"></nuxt-image>
          <div class="absolute inset-0 flex flex-col items-center pt-[60px]">
            <icon-cert-name :style="{ width: '262px', height: '36px' }"></icon-cert-name>
            <p class="mt-5">证书编号： ACU_793790#1/4</p>
            <div class="flex w-full justify-between px-[50px] pt-[72px] text-black">
              <div>
                <div class="mb-5 rounded-[10px] border border-solid border-white bg-[rgba(255,255,255,0.38)] p-2">
                  <Image class="block h-[260px] w-[180px] rounded-[10px]" pic-url=""></Image>
                </div>
                <p>藏品哈希值：</p>
                <p class="w-[198px] break-all text-[12px]">
                  s56sd6fas4sd1412xx4515156561151ds5151x145sw5ds514g4hg5n514dxzc14dsfg4s6458912100fsd0565f56554fassf4
                </p>
              </div>
              <div class="w-[192px] leading-[22px]">
                <p class="mb-1 text-[16px] font-medium">花开很富贵</p>
                <p class="mb-[26px]">收藏者</p>
                <p class="mb-1 text-[16px] font-medium">竖琴复古边椅</p>
                <p class="mb-[26px]">藏品名称</p>
                <p class="mb-1 text-[16px] font-medium">觅觅mimi</p>
                <p class="mb-[26px]">创作者</p>
                <p class="mb-1 text-[16px] font-medium">2024.04.15</p>
                <p class="mb-[26px]">发证日期</p>
                <p class="relative mb-1 text-[16px] font-medium">
                  杭州蚂蚁酷爱科技有限公司
                  <nuxt-image
                    class="absolute left-[60px] top-[-34px] h-[112px] w-[112px]"
                    :src="require('@/assets/images/seal-temp.png')"></nuxt-image>
                </p>
                <p class="mb-[26px]">发证单位</p>
              </div>
            </div>
          </div>
        </div>
        <a-button @click="screenshot" class="my-[45px] h-[50px] w-[400px] text-[16px]" size="large" type="primary">保存</a-button>
      </div>
    </a-dialog> -->
  </div>
</template>
<script setup lang="ts">
// import html2canvas from "html2canvas"

// const certDOM = ref<HTMLDivElement>()
// const screenshot = () =>
//   html2canvas(certDOM.value!).then((canvas) => {
//     canvas.toBlob(
//       (blob) => {
//         const url = URL.createObjectURL(blob!)
//         downloadFile(url)
//         URL.revokeObjectURL(url)
//       },
//       "image/jpeg",
//       1
//     )
//   })
</script>
<style lang="scss" scoped>
.wrap {
  :deep(.el-dialog) {
    border-radius: 16px;

    --el-dialog-padding-primary: 55px 40px 0;
    .el-dialog__headerbtn {
      top: 12px;
      right: 8px;
    }
    .el-dialog__close {
      font-size: 20px;
    }
  }
}
</style>
