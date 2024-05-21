<template>
  <div class="main-header border-btm">
    <logo-item></logo-item>
    <div class="menus">
      <ul class="text-[16px] font-medium">
        <li>
          <NuxtLink active-class="text-blue" to="/">首页</NuxtLink>
        </li>
        <li>
          <NuxtLink active-class="text-blue" :to="INDEX_ROUTE.ASSET">3D资产</NuxtLink>
        </li>
        <li>
          <NuxtLink active-class="text-blue" :to="INDEX_ROUTE.DESIGNER">设计师</NuxtLink>
        </li>
        <li>
          <NuxtLink active-class="text-blue" :to="INDEX_ROUTE.LIMIT_ASSET">限量资产</NuxtLink>
        </li>
        <li>
          <NuxtLink active-class="text-blue" :to="INDEX_ROUTE.BUSINESS_DOCK">商业对接</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="search header-search-box">
      <a-input
        style="width: 100%"
        allow-clear
        v-model:value="searchContent"
        @keyup.enter="searchHandle"
        placeholder="请输入关键字搜索">
        <template #prefix>
          <a-select
            v-model:value="selectSearch"
            :options="
              SEARCH_ITEMS.map((e) => ({
                label: e.name,
                value: e.id
              }))
            "
            style="width: 94px"></a-select>
          <div class="h-[18px] w-[1px] bg-[#cccccc80]"></div>
        </template>
        <template #suffix>
          <icon-search class="mr-5 h-[20px] w-[20px] cursor-pointer text-[#909399]" v-debounce="searchHandle"></icon-search>
        </template>
      </a-input>
    </div>
    <user-operation-header></user-operation-header>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const cartStore = useCartStore()

// 搜索相关
const selectSearch = ref(1)
const searchContent = ref("")

const searchHandle = () => {
  navigateTo({
    name: "search",
    query: {
      searchType: selectSearch.value,
      searchContent: searchContent.value
    }
  })
  nextTick(() => {
    searchContent.value = ""
  })
}
onMounted(() => {
  if (authStore.accessToken) {
    cartStore.getCartDetail()
  }
})
</script>
<style lang="scss" scoped>
.main-header {
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 36px;
  .logo {
    margin-right: 53px;

    @media screen and (width <= $screen-width-lg) {
      margin-right: 20px;
    }

    @media screen and (width <= $screen-width-med) {
      margin-right: 15px;
    }
  }

  @media screen and (width <= $screen-width-lg) {
    padding: 0 30px;
  }

  @media screen and (width <= $screen-width-med) {
    padding: 0 20px;
  }
  .menus {
    ul {
      display: flex;
      flex-direction: row;
      li {
        padding: 0 25px;
        &.active {
          color: var(--el-color-primary);
        }

        @media screen and (width <= $screen-width-lg) {
          padding: 0 20px;
        }

        @media screen and (width <= $screen-width-med) {
          padding: 0 14px;
        }
      }
    }
  }
  .search {
    flex: 1;
    align-items: center;
    padding-left: 130px;

    @media screen and (width <= $screen-width-lg) {
      padding-left: 50px;
    }

    @media screen and (width <= $screen-width-med) {
      padding-left: 40px;
    }
  }
}
</style>
<style lang="scss">
.header-search-box {
  .ant-input-affix-wrapper {
    height: 42px;
    padding: 0;
    background-color: #f6f8ff;
    border: 1px solid #ebebed;
    border-radius: 40px;
    .ant-select {
      margin-inline-end: 0;
      .ant-select-selector {
        padding: 0 16px;
        background-color: transparent;
        border: none !important;
        box-shadow: none !important;
      }
      .ant-select-selection-item {
        line-height: 40px;
      }
      .ant-select-arrow {
        inset-inline-end: 18px;
        width: 10px;
        height: 10px;
        margin-top: -5px;
      }
    }
    .ant-input {
      background-color: transparent;
    }
    .ant-input-prefix {
      margin-inline-end: 15px;
    }
    .ant-input-suffix {
      margin-inline-start: 15px;
      .ant-input-clear-icon {
        display: block;
        .anticon-close-circle {
          display: block;
        }
      }
    }
  }
}
</style>
