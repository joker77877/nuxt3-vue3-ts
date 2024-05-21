<template>
  <!-- 登录注册 -->
  <Teleport to="body">
    <LoginPopup v-if="showPopupName !== null" :title="popupTitle" @close-popup="closePopupHandle">
      <div class="form" v-if="showPopupName === PopupTypeEnum.REGISTER">
        <PhoneSet type="register" text="下一步" @submit="registerHandle" @close-popup="closePopupHandle"></PhoneSet>
        <p class="go-login">
          已有账号，
          <span class="text-blue cursor-pointer" @click="showPopupHandle(PopupTypeEnum.LOGIN)">立即登录</span>
        </p>
      </div>
      <Login
        v-if="showPopupName === PopupTypeEnum.LOGIN"
        :tabname="loginTabName"
        @forget-password="showPopupHandle(PopupTypeEnum.FORGET_PASSWORD)"
        @show-register="showPopupHandle(PopupTypeEnum.REGISTER)"
        @close-popup="closePopupHandle"></Login>
      <div class="form" v-if="showPopupName === PopupTypeEnum.BIND_PHONE">
        <PhoneSet type="setPhone" text="完成" @submit="bindMobileHandle"></PhoneSet>
        <el-link :underline="false" class="skip" @click="skipBindHandle">跳过绑定</el-link>
      </div>
      <FindPassword v-if="showPopupName === PopupTypeEnum.FORGET_PASSWORD" @show-login="resetPwdSuccessHandle"></FindPassword>
    </LoginPopup>
  </Teleport>
</template>
<script setup lang="ts">
const authStore = useAuthStore()

const showPopupName = ref<PopupTypeEnumType | null>(null)
const popupTitles = ["", "注册", "找回密码"]
const popupTitle = ref("")
const loginTabName = ref("")

const showPopupHandle = (type: PopupTypeEnumType) => {
  showPopupName.value = type
  popupTitle.value = popupTitles[type]
}

const closePopupHandle = (hasLogin?: boolean) => {
  if (hasLogin) {
    $bus.emit("loginStateChanged")
  }
  showPopupName.value = null
  popupTitle.value = ""
  loginTabName.value = ""
}

$bus.on("showLoginPopup", (type?: PopupTypeEnum) => {
  showPopupHandle(type || PopupTypeEnum.LOGIN)
})

$bus.on("closePopupHandle", () => {
  closePopupHandle()
})

const registerHandle = async (params: Register.ReqRegisterByPhone) => {
  // 预加载路由会加载用户可能在未来导航到的给定路由的组件。这样确保了组件提前可用，并且不太可能阻塞导航，从而提高性能
  preloadRouteComponents("@/pages/user/SetUserInfo")
  const res: any = await registerByPhoneApi({
    mobile: params.mobile.trim(),
    code: params.code,
    password: params.password
  })
  authStore.saveAuth(res.data)
  message.success("注册成功")
  closePopupHandle()
  nextTick(() => {
    $bus.emit("loginStateChanged")
  })
  window.open("/user/set-info", "_self")
  // navigateTo("/user/set-info")
}
const skipBindHandle = () => {
  console.log("微信登录后跳过绑定手机号")
}

const bindMobileHandle = () => {
  console.log("微信登录后绑定手机号")
}

const resetPwdSuccessHandle = (type: string) => {
  loginTabName.value = type
  showPopupHandle(PopupTypeEnum.LOGIN)
}
</script>
<style lang="scss" scoped></style>
