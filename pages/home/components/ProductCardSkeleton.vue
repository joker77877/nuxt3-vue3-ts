<!-- 产品card -->
<template>
  <skeleton animate>
    <div class="bg-white">
      <div class="relative pt-[67.57%] before:block before:content-['']">
        <skeleton-block class="absolute inset-0 h-full w-full"></skeleton-block>
      </div>
      <div class="px-3 pb-[15px] pt-3 leading-[22px]">
        <div class="flex items-center justify-between">
          <skeleton-text w="33"></skeleton-text>
          <skeleton-text w="33"></skeleton-text>
        </div>
        <div class="flex justify-between pt-2">
          <div class="flex-1 flex-items-center">
            <skeleton-avatar class="h-[24px] w-[24px]"></skeleton-avatar>
            <skeleton-text class="ml-2" w="22"></skeleton-text>
          </div>
          <skeleton-text w="22"></skeleton-text>
        </div>
      </div>
    </div>
  </skeleton>
</template>
