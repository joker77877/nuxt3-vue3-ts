<template>
  <a-carousel autoplay arrows v-bind="$attrs">
    <slot></slot>
    <template #prevArrow>
      <div class="carousel-arrow prev">
        <icon-prev class="h-5"></icon-prev>
      </div>
    </template>
    <template #nextArrow>
      <div class="carousel-arrow next">
        <icon-next class="h-5"></icon-next>
      </div>
    </template>
  </a-carousel>
</template>

<style lang="scss" scope>
.ant-carousel .carousel-arrow.slick-arrow {
  z-index: 1;
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-top: -28px;
  color: rgb(245 245 245 / 50.2%);
  user-select: none;
  background-color: rgb(71 71 71 / 30%);
  border-radius: 999px;
  transition: all 0.2s;
  &:hover {
    color: rgb(245 245 245 / 100%);
    background-color: rgb(71 71 71 / 50%);
  }
  &.prev {
    inset-inline-start: 60px;
  }
  &.next {
    inset-inline-end: 60px;
  }
}
</style>
