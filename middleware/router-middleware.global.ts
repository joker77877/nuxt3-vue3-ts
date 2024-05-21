export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  // 需要调起登录弹窗的页面校验
  if (NO_AUTH_PAGES.some((e) => to.path.includes(e || "")) && !authStore.accessToken) {
    $bus.emit("showLoginPopup")
  }
})
