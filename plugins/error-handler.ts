export default defineNuxtPlugin((nuxtApp) => {
  // 捕获 Vue 错误
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // 处理错误，例如上报到一个服务
    console.log("error*****************************", error, instance, info)
  }
})
