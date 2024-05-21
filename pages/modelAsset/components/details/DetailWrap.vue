<template>
  <div class="flex pt-[30px] pb-[50px] px-6 fixed-width">
    <div class="flex-1">
      <slot name="left"></slot>
    </div>
    <div class="w-[452px] ml-10 flex-shrink-0">
      <slot name="right"></slot>
    </div>
    <ToTop></ToTop>
  </div>
</template>
