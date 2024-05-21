<template>
  <skeleton animate>
    <div class="rounded-lg px-[15px] py-[20px] shadow-[0_2px_4px_0_rgba(0,0,0,0.12)]">
      <div class="flex pb-[25px]">
        <skeleton-avatar class="mr-[15px] h-[60px] w-[60px]"></skeleton-avatar>
        <div class="flex-1 leading-[25px]">
          <skeleton-text w="77" class="mb-[6px]"></skeleton-text>
          <div class="flex">
            <skeleton-text w="18" class="mr-[16px]"></skeleton-text>
            <skeleton-text w="18"></skeleton-text>
          </div>
        </div>
      </div>
      <div class="relative pt-[65.29%] before:block before:content-['']">
        <skeleton-block class="absolute inset-0"></skeleton-block>
      </div>
      <skeleton-block class="mb-[15px] mt-[25px] h-[32px]"></skeleton-block>
    </div>
  </skeleton>
</template>
