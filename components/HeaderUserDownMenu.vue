<template>
  <!-- <ClientOnly> -->
  <a-dropdown trigger="click" v-if="!!authStore.accessToken" popper-class="rounded-[10px]" :arrow="{ pointAtCenter: true }">
    <span class="el-dropdown-link flx-center">
      <NuxtImg class="user-avatar ml10" is-avatar :src="authStore.userInfo?.avatar || '/images/user-default.png'"></NuxtImg>
    </span>
    <template #overlay>
      <a-menu class="dropdown w-[227px] rounded-[10px]">
        <a-menu-item class="group px-[25px] py-0" @click="goUserInfoHandle">
          <div class="w-full border-b border-solid border-[#EBEBED] py-5 flex-items-center">
            <icon-user class="base-icon mr18 group-hover:text-blue"></icon-user>
            <span class="text-[16px] font-medium leading-[22px]">个人中心</span>
          </div>
        </a-menu-item>
        <a-menu-item class="group px-[25px] py-0" @click="logoutHandle">
          <div class="w-full py-5 flex-items-center">
            <icon-quit class="base-icon mr18 group-hover:text-blue"></icon-quit>
            <span class="text-[16px] font-medium leading-[22px]">退出登录</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <div class="flx-align-center" v-else>
    <li class="menu-li"><span class="menu-item hover-pointer" @click="showPopupHandle(PopupTypeEnum.LOGIN)">登录</span></li>
    <li class="menu-li"><span class="menu-item hover-pointer" @click="showPopupHandle(PopupTypeEnum.REGISTER)">注册</span></li>
  </div>
  <!-- </ClientOnly> -->
</template>
<script setup lang="ts">
const cartStore = useCartStore()
const authStore = useAuthStore()

$bus.on("loginStateChanged", () => {
  cartStore.getCartDetail()
})

$bus.on("updateUserInfo", () => {
  nextTick(() => {})
})

const goUserInfoHandle = () => {
  navigateTo(USER_CENTER_MENUS_MAP.product)
}

const logoutHandle = async () => {
  await logoutApi()
  await authStore.clearAuth()
  await authStore.clearUserInfo()
  cartStore.logout() // 购物车信息情况
  message.success("退出登录成功")
  navigateTo("/", { replace: true })
}

const showPopupHandle = (type: PopupTypeEnumType) => {
  $bus.emit("showLoginPopup", type)
}
</script>
<style lang="scss" scoped>
ul,
li {
  list-style: none;
}
.user-avatar {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 20px;
}
.menu-item {
  padding: 0 11px;
  a {
    font-size: var(--el-font-size-medium);
  }
}
.go-login {
  color: var(--el-color-info);
  span {
    cursor: pointer;
  }
}
.skip {
  color: var(--el-color-info-light-3);
}
:deep(.menu-li) {
  &.active {
    color: var(--el-color-primary);
  }
  .el-link {
    font-size: var(--el-font-size-medium);
  }
  .menu-item {
    cursor: pointer;
  }
}
</style>
