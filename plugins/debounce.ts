/**
 * v-debounce
 * 按钮防抖指令，可自行扩展至input
 * 接收参数：function类型
 */

interface ElType extends HTMLElement {
  __handleClick__: (event?: any) => any
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("debounce", {
    mounted(el: ElType, binding: DirectiveBinding) {
      if (typeof binding.value !== "function") {
        throw "callback must be a function"
      }
      let timer: NodeJS.Timeout | null = null
      el.__handleClick__ = function (event) {
        if (timer) {
          clearInterval(timer)
        }
        timer = setTimeout(() => {
          binding.value(event)
        }, 500)
      }
      el.addEventListener("click", el.__handleClick__)
    },
    beforeUnmount(el: ElType) {
      el.removeEventListener("click", el.__handleClick__)
    }
  })
})
