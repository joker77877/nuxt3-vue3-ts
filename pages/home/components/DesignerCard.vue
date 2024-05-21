<!-- 产品card -->
<template>
  <div class="designer-card-item">
    <dl>
      <dt>
        <div class="person-pic mr15">
          <Image :pic-url="props.designerItem.creatorUrl" :is-avatar="true" fit="fill"></Image>
        </div>
        <div class="person-info">
          <h3 class="title-3 sle">{{ props.designerItem.creator }}</h3>
          <div class="pt6">
            <span class="pr16">
              <span class="sub-title pr8">粉丝</span>
              <span>{{ props.designerItem.attentionCount }}</span>
            </span>
            <span class="sub-title pr8">作品</span>
            <span>{{ props.designerItem.moduleCount }}</span>
          </div>
        </div>
      </dt>
      <dd class="pt25">
        <div class="relative pt-[65.29%]" @click="goDetail">
          <div class="absolute inset-0">
            <Image class="h-full w-full" :pic-url="props.designerItem.picUrl" fit="cover"></Image>
          </div>
        </div>
        <div class="operation pt25 pb15">
          <el-button type="primary" @click="handlerAttention" v-if="!props.designerItem.designer">关注</el-button>
          <el-button @click="handlerCancelAttention" v-else>已关注</el-button>
        </div>
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts" name="DesignerCard">
import { followDesigner, cancelFollowDesigner } from "@/api/modules/designer"

type Props = {
  designerItem: Designer.ResDesignerItem
}
const emit = defineEmits(["change"])
const props = withDefaults(defineProps<Props>(), {})
const handlerAttention = async () => {
  await followDesigner(props.designerItem.creatorId)
  emit("change", props.designerItem.creatorId, true)
}
const handlerCancelAttention = async () => {
  await cancelFollowDesigner(props.designerItem.creatorId)
  emit("change", props.designerItem.creatorId, false)
}
const goDetail = () => {
  window.open(`/asset/${props.designerItem.id}`, "_blank")
}
</script>
<style lang="scss" scoped>
.designer-card-item {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  cursor: pointer;
  background-color: #f6f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
  .person-info {
    // 1920-2040
    @media screen and (min-width: $screen-width-xlg) {
      .title-3 {
        max-width: 190px;
      }
    }

    // ~-1200
    @media screen and (max-width: $screen-width-s) {
      grid-template-columns: repeat(4, 1fr);
      .title-3 {
        max-width: 140px;
      }
    }

    // 1200-1559
    @media screen and (min-width: $screen-width-s) and (max-width: $screen-width-lg) {
      .title-3 {
        max-width: 140px;
      }
    }

    // 1560-1919
    @media screen and (min-width: $screen-width-lg) and (max-width: $screen-width-xlg) {
      .title-3 {
        max-width: 170px;
      }
    }
  }
  dt {
    position: relative;
    display: flex;
    .person-pic {
      display: flex;
      align-items: center;
      .el-image {
        width: 60px;
        height: 60px;
        border: 1px solid var(--el-border-color);
        border-radius: 50%;
      }
    }
  }
  dd {
    display: flex;
    flex-direction: column;
    .el-image {
      border-radius: 8px;
    }
    .operation {
      width: 100%;
      .el-button {
        width: 100%;
      }
    }
  }
  .img-wrap {
    text-align: center;
    :deep(.el-image) {
      // width: 100%;
      height: 100%;
      img {
        height: 100%;
      }
    }
  }
}
</style>
