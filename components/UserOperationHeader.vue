<template>
  <div class="operation">
    <ul class="operation-list">
      <li class="fix-top cursor-pointer">
        <cart-item></cart-item>
      </li>
      <li>
        <icon-message class="cursor-pointer"></icon-message>
      </li>
      <li v-if="role === UserRoles.ARTIST || role === UserRoles.DESIGNER">
        <a-dropdown placement="bottom" arrow>
          <a-button type="primary" size="small" shape="round">
            <span class="text-xs">上传作品</span>
          </a-button>
          <template #overlay>
            <a-menu class="pt4 pb4">
              <a-menu-item class="pb20 pt20 pr12 plt12 mita-border-b">
                <nuxt-link @click="onClickUpload(false)" class="ft16 fw500">
                  <icon-asset-upload class="inline-block h-[20px] w-[20px] cursor-pointer mr8"></icon-asset-upload>
                  发布作品
                </nuxt-link>
              </a-menu-item>
              <a-menu-item class="pb20 pt20 pr12 plt12">
                <nuxt-link @click="onClickUpload(true)" class="ft16 fw500">
                  <icon-limit-asset-upload class="inline-block h-[20px] w-[20px] cursor-pointer mr8"></icon-limit-asset-upload>
                  创作限量藏品
                </nuxt-link>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </li>
      <li v-else>
        <a-button type="primary" @click="onClickUpload(false)" size="small" shape="round">
          <span class="text-xs">上传作品</span>
        </a-button>
      </li>
      <HeaderUserDownMenu></HeaderUserDownMenu>
    </ul>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const role = computed(() => userInfo.value?.userRole || 1)
const onClickUpload = (isLimited = false) => {
  if (authStore.accessToken) {
    if (isLimited) {
      navigateTo(`${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.UPLOAD_WORK}`)
    } else {
      navigateTo(INDEX_ROUTE.UPLOAD_WORK)
    }
  } else {
    $bus.emit("showLoginPopup")
  }
}
</script>
<style lang="scss" scoped>
.operation {
  margin-left: 19px;
  ul.operation-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    li {
      display: flex;
      align-items: center;
      padding: 0 11px;
      a {
        font-size: var(--el-font-size-medium);
      }
    }
    .dropdown-item-text {
      font-size: var(--el-font-size-medium);
    }
  }
}
</style>
