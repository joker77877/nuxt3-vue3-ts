export const useAuthStore = defineStore(
  "auth",
  () => {
    const accessToken = ref<string | null>()
    const refreshToken = ref<string | null>()
    const userId = ref<number | null>(null)
    const userInfo = ref<User.UserInfo | null>()

    async function saveAuth(params: AuthState) {
      accessToken.value = params.accessToken
      refreshToken.value = params.refreshToken
      userId.value = params.userId
    }

    function clearAuth() {
      accessToken.value = null
      refreshToken.value = null
      userId.value = null
    }

    function clearUserInfo() {
      userInfo.value = null
    }

    // 更新用户信息
    async function updateUserInfo(userInfoData?: User.UserInfo) {
      if (userInfoData) {
        userInfo.value = userInfoData
      } else {
        const data = await getUserInfoApi()
        console.log("更新用户信息", data)
        userInfo.value = data
      }
      $bus.emit("updateUserInfo")
    }

    return {
      accessToken,
      refreshToken,
      userId,
      userInfo,
      saveAuth,
      updateUserInfo,
      clearAuth,
      clearUserInfo
    }
  },
  {
    persist: true
  }
)
