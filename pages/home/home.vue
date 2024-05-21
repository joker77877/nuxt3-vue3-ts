<template>
  <div class="home">
    <div class="banner-wrapper">
      <Banner></Banner>
    </div>
    <div class="main-section fixed-width-min-to-max">
      <!-- 中间tab页 -->
      <div class="main-content">
        <el-affix v-if="headerShow">
          <div class="logo-tab-header"><logo-item></logo-item></div>
          <div class="operation-user-header"><user-operation-header></user-operation-header></div>
        </el-affix>
        <a-tabs :destroy-inactive-tab-pane="true" v-model:activeKey="activeName" class="meta3d-tabs" id="home-tab">
          <a-tab-pane tab="推荐" :key="tabEnum.RECOMMEND">
            <recommend-tab-item></recommend-tab-item>
          </a-tab-pane>
          <a-tab-pane lazy tab="关注" :key="tabEnum.FOLLOW">
            <follow-tab-item></follow-tab-item>
          </a-tab-pane>
          <a-tab-pane lazy tab="最新上传" :key="tabEnum.LAST_UPLOAD">
            <last-upload-tab-item></last-upload-tab-item>
          </a-tab-pane>
          <a-tab-pane lazy tab="最热门" :key="tabEnum.TOP">
            <top-tab-item></top-tab-item>
          </a-tab-pane>
          <a-tab-pane lazy tab="下载排行" :key="tabEnum.TOP_DOWNLOAD">
            <download-tab-item></download-tab-item>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 当前激活的tab页
const activeName = ref(TabNameEnum.RECOMMEND)
// tab枚举值
const tabEnum = ref(TabNameEnum)

const headerShow = ref(false)
const handlerFixTop = () => {
  const docs = document.getElementById("home-tab")?.getElementsByClassName("el-tabs__header")
  if (docs && docs.length) {
    const distance = docs[0].getBoundingClientRect().top
    if (distance <= 0) {
      docs[0].classList.add("fix-tab-header")
      headerShow.value = true
    } else {
      docs[0].classList.remove("fix-tab-header")
      headerShow.value = false
    }
  }
}

onMounted(() => {
  window.addEventListener("scroll", handlerFixTop)
})
onUnmounted(() => {
  window.removeEventListener("scroll", handlerFixTop)
})
</script>
<style lang="scss">
.home {
  .meta3d-tabs > .ant-tabs-nav {
    justify-content: center;
    .ant-tabs-nav-wrap {
      flex: 0 0 auto;
    }
    .ant-tabs-tab {
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      color: #797979;
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #09090a;
      }
    }
    .ant-tabs-ink-bar {
      background: #09090a;
    }
  }
  .fix-tab-header {
    position: sticky;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
    background-color: #ffffff;
  }
  .main-section {
    // min-width: $min-width;
    // max-width: $max-width;
    padding: 10px 0;

    // margin: 0 auto;
    .main-content {
      position: relative;
      .logo-tab-header {
        position: absolute;
        top: 18.5px;
        left: 20px;
      }
      .operation-user-header {
        position: absolute;
        top: 0;
        right: 20px;
        display: flex;
        align-items: center;
        height: 60px;
      }
    }
    .product-section {
      padding-bottom: 38px;
      margin: 0 auto;
    }
    .more-wrap {
      text-align: center;
      .el-button.is-round {
        padding: 8px 43px;
      }
    }
    .product-list {
      padding: 15px 50px 0;
      margin: 0 auto;
    }
  }
}
</style>
