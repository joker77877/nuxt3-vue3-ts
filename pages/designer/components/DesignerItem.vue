<template>
  <div class="designer-item flx-justify-between pb20" :key="designer.id">
    <div class="flx-align-center flex-full">
      <DesignerInfo :designer-info="designer"></DesignerInfo>
      <div class="works" v-if="!designer.recentWorks">
        <div class="work-empty">
          <NuxtImg preload src="/images/empty-works.png" style="width: 100%" alt="暂无发布作品"></NuxtImg>
          <span class="title">暂无发布作品</span>
        </div>
        <div></div>
        <div></div>
      </div>
      <div class="works" v-else>
        <DesignerWork v-for="work in designer.recentWorks" :key="work.id" :designer-work="work"></DesignerWork>
      </div>
    </div>
    <icon-more class="more-btn base-icon ml7" @click="goDesignerDetail(designer.id)"></icon-more>
  </div>
</template>
<script setup lang="ts">
interface Props {
  designer: Designer.SearchDesignerItem
}

const { designer } = defineProps<Props>()

const goDesignerDetail = (designerId: string) => {
  navigateTo(`/designer/${designerId}`)
}
</script>
<style lang="scss" scoped>
.more-btn {
  color: #cccccc;
  cursor: pointer;
}
.work-empty {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  border-radius: 8px;
  .title {
    position: absolute;
    bottom: 30px;
    left: 0;
    display: block;
    width: 100%;
    font-size: var(--el-font-size-base);
    font-weight: 400;
    line-height: 22px;
    color: #a6a6a6;
    text-align: center;
  }
}
:deep(.el-empty) {
  .el-empty__image {
    width: auto;
    height: 120px;
  }
}
.small {
  .works {
    grid-template-columns: repeat(3, 1fr);

    // 1920-2040
    // @media screen and (min-width: $screen-width-xlg) {
    //   grid-template-columns: repeat(5, 1fr);
    // }

    // // ~-1200
    // @media screen and (max-width: $screen-width-s) {
    //   grid-template-columns: repeat(3, 1fr);
    // }

    // // 1200-1559
    // @media screen and (min-width: $screen-width-s) and (max-width: $screen-width-lg) {
    //   grid-template-columns: repeat(3, 1fr);
    // }

    // // 1560-1919
    // @media screen and (min-width: $screen-width-lg) and (max-width: $screen-width-xlg) {
    //   grid-template-columns: repeat(4, 1fr);
    // }
  }
}
.works {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  padding-left: 43px;

  // 1920-2040
  // @media screen and (min-width: $screen-width-xlg) {
  //   grid-template-columns: repeat(6, 1fr);
  // }

  // // ~-1200
  // @media screen and (max-width: $screen-width-s) {
  //   grid-template-columns: repeat(4, 1fr);
  // }

  // // 1200-1559
  // @media screen and (min-width: $screen-width-s) and (max-width: $screen-width-lg) {
  //   grid-template-columns: repeat(4, 1fr);
  // }

  // // 1560-1919
  // @media screen and (min-width: $screen-width-lg) and (max-width: $screen-width-xlg) {
  //   grid-template-columns: repeat(5, 1fr);
  // }
}
</style>
