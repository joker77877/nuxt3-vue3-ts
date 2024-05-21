export default () => {
  const checkIsLogin = () => {
    const authStore = useAuthStore()
    if (!authStore.accessToken) {
      $bus.emit("showLoginPopup")
    }
    return !!authStore.accessToken
  }
  return { checkIsLogin }
}
