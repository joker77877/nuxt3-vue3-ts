import qs from "qs"

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean
  hideErrorTips?: boolean // 接口发生错误时是否需要显示错误信息，非必填，默认为true
}

const setting: AxiosRequestConfig = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  // baseURL: "/api",
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true
}

class RequestHttp {
  service: AxiosInstance

  public constructor(c: AxiosRequestConfig) {
    // instantiation
    this.service = axios.create(c)

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // 当前请求需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: true } 来控制
        config.loading ?? (config.loading = false)
        config.loading && showFullScreenLoading()
        // 设置header -- 租户信息
        config.headers["tenant-id"] = 1
        try {
          const authStore = useAuthStore()
          const token = authStore.accessToken
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (err) {
          console.log("设置token失败", err)
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response
        tryHideFullScreenLoading()
        // 登陆失效
        if (data.code === ResultEnum.OVERDUE) {
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
              return matchUrl === response.config.url
            }
            return matchUrl.test(response.config.url as string)
          })
          if (!isInWhiteUrl) {
            $bus.emit("showLoginPopup")
            return Promise.reject(data)
          }
          // 是否需要显示错误信息
          if (!(response.config as CustomAxiosRequestConfig).hideErrorTips) {
            message.error(data.msg)
          }
          return Promise.reject(data)
        }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          // 是否需要显示错误信息
          if (!(response.config as CustomAxiosRequestConfig).hideErrorTips) {
            message.error(data.msg)
          }
          return Promise.reject(data)
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data
      },
      async (error: AxiosError) => {
        const { response } = error
        tryHideFullScreenLoading()
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf("timeout") !== -1) {
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
    )
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>["data"]> {
    return new Promise((resolve) => {
      this.service
        .get(url, {
          params,
          ..._object,
          paramsSerializer(p) {
            return qs.stringify(p, { arrayFormat: "repeat" })
          }
        })
        .then((e) => {
          resolve(e.data)
        })
    })
  }

  post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>["data"]> {
    return new Promise((resolve) => {
      this.service.post(url, params, _object).then((e) => {
        resolve(e.data)
      })
    })
  }

  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return new Promise((resolve) => {
      this.service.put(url, params, _object).then((e) => {
        resolve(e.data)
      })
    })
  }

  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return new Promise((resolve) => {
      this.service
        .delete(url, {
          params,
          ..._object,
          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: "repeat" })
          }
        })
        .then((e) => {
          resolve(e.data)
        })
    })
  }

  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" })
  }

  upload<T>(url: string, params?: object, _object: AxiosRequestConfig = {}): Promise<ResultData<T>> {
    return this.service.postForm(url, params, { ..._object })
  }
}
const http = new RequestHttp(setting)
