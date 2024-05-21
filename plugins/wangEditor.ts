import { Editor, Toolbar } from "@wangeditor/editor-for-vue"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component("WeEditor", Editor)
  nuxt.vueApp.component("WeToolbar", Toolbar)
})
