<template>
  <div @click="$router.back()" class="flex cursor-pointer text-[18px] leading-[24px]">
    <icon-back class="h-[24px] w-[24px]"></icon-back>
    <span class="ml-2">返回</span>
  </div>
  <div class="relative mx-[100px] mt-[50px] flex flex-col items-center rounded-[10px] bg-[#fdf9f2] px-[25px] py-[30px]">
    <icon-result-lacework class="w-full text-[#86DAFF]"></icon-result-lacework>
    <icon-result-header class="mt-[14px]" :style="{ width: '424px', height: 'auto' }"></icon-result-header>
    <div class="w-full px-[100px] py-[40px] leading-[22px]">
      <slot></slot>
    </div>
    <div
      class="absolute bottom-[200px] left-[30px] top-[200px] w-[5px] bg-[url(/images/result-img-border.png)] bg-[length:100%_auto]"></div>
    <div
      class="absolute bottom-[200px] right-[30px] top-[200px] w-[5px] bg-[url(/images/result-img-border.png)] bg-[length:100%_auto]"></div>
    <icon-result-lacework class="w-full text-[#86DAFF]" :style="{ transform: 'rotateX(180deg)' }"></icon-result-lacework>
  </div>
</template>
