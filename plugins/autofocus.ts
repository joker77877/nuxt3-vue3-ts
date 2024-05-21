/**
 * v-autofocus
 * 自动聚焦
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("autofocus", {
    mounted(el) {
      nextTick(() => {
        if (el.tagName === "INPUT") {
          el!.focus()
        } else {
          // 兼容el-input
          el!.querySelector("input")!.focus()
        }
      })
    },
    getSSRProps(binding, vnode) {
      // 你可以在这里提供SSR特定的props
      return {}
    }
  })
})
