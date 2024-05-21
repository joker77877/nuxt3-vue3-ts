/* eslint-disable no-underscore-dangle */

export interface ResOptions<T> {
  data: T
  code: number
  msg: string
}
const fetch = $fetch.create({
  timeout: ResultEnum.TIMEOUT as number,
  baseURL: process.server && import.meta.dev ? BASE_URL : "/",
  // 请求拦截器
  onRequest(res) {
    // get方法传递数组形式参数
    // 添加请求头,没登录不携带token
    const { options } = res
    // options.params = paramsSerializer(options.params)
    try {
      options.headers = new Headers()
      // if (process.client) {
      const authStore = useAuthStore()
      const token = authStore.accessToken
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`)
      }
      // }

      options.headers.set("tenant-id", "1")
    } catch (error) {
      message.error("设置token失败")
    }

    //         // 当前请求需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: true } 来控制
    //         config.loading ?? (config.loading = false)
    //         config.loading && showFullScreenLoading()
  },
  onRequestError(res) {
    if (res.error.message.includes("signal is aborted without reason")) {
      errorTip("请求超时，请稍后再尝试")
      return Promise.reject(res.error)
    }
    errorTip("请检查网络是否正常")
    return Promise.reject(res.error)
  },
  // 响应拦截
  onResponse({ response }) {
    const { _data: data, url } = response
    const code = data?.code
    const msg = data.msg || "网络异常，请稍后再试"

    tryHideFullScreenLoading()
    // 登陆失效
    if (code === ResultEnum.OVERDUE) {
      // 刷新令牌
      /**
       * useAuthStore放到外面会报错，需要延迟调用 useStore()
       * request 他是一个特殊的js文件，它会在程序开始的时候立刻执行（因为调用了接口）。但是这时pinia还没有初始化完成，所以才会报错
       */

      const authStore = useAuthStore()
      authStore.clearAuth()
      authStore.clearUserInfo()

      $bus.emit("updateUserInfo")
      // 判断当前接口是否在白名单中
      const isInWhiteUrl = AUTH_WHITE_LIST.find((matchUrl: string | RegExp) => {
        if (typeof matchUrl === "string") {
          return url.includes(matchUrl)
        }
        return matchUrl.test(url as string)
      })
      if (!isInWhiteUrl) {
        $bus.emit("showLoginPopup")
        return Promise.reject(msg)
      }
      errorTip(msg)

      return Promise.reject(data)
    }
    if (code !== ResultEnum.NORMAL) {
      // 是否显示错误
      const isHideError = hideErrorApi.some((item) => {
        return url.includes(item)
      })
      if (!isHideError) {
        errorTip(msg)
      }

      return Promise.reject(data)
    }
    return undefined
  },
  // 错误处理
  onResponseError({ response, error }) {
    tryHideFullScreenLoading()
    // 请求超时 && 网络错误单独判断，没有 response
    if (error?.message.indexOf("timeout") !== -1) {
      message.error("请求超时！请您稍后重试")
      return Promise.reject(error)
    }
    if (error.message.indexOf("Network Error") !== -1) {
      message.error("网络错误！请您稍后重试")
      return Promise.reject(error)
    }
    // 根据服务器响应的错误状态码，做不同的处理
    if (response) {
      checkStatus(response.status)
      return Promise.reject(error)
    }
    // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
    if (!window?.navigator.onLine) {
      message.error("网络错误！请您稍后重试")
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
})

// 自动导出
export const http = {
  get: <T>(url: string, params?: any) => {
    return new Promise<T>((resolve, reject) => {
      fetch<ResOptions<T>>(url, { method: "get", params })
        .then((e) => {
          resolve(e.data)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },

  post: <T>(url: string, body?: any, config: Omit<FetchOptions, "method"> = {}) => {
    return new Promise<T>((resolve, reject) => {
      fetch<ResOptions<T>>(url, { method: "post", body, ...config })
        .then((e) => {
          resolve(e.data)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })
  },
  download: <T>(url: string, body?: any, config: Omit<FetchOptions, "method"> = {}) => {
    return fetch<T>(url, { method: "post", body, ...config })
  },
  upload: <T>(url: string, body?: any, config: Omit<FetchOptions, "method"> = {}) => {
    const formData = new FormData()
    Object.keys(body).forEach((k) => {
      formData.append(k, body[k])
    })
    return new Promise<T>((resolve) => {
      fetch<ResOptions<T>>(url, { method: "post", body: formData, ...config }).then((e) => {
        resolve(e.data)
      })
    })
  },

  put: <T>(url: string, body?: any) => {
    return fetch<T>(url, { method: "put", body })
  },

  delete: <T>(url: string, body?: any, params?: any) => {
    return fetch<T>(url, { method: "delete", params, body })
  }
}
