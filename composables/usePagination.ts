/**
 * 分页
 */
export default (distance: number = 80) => {
  const isScrollToBottom = ref(false)

  onMounted(() => {
    document.addEventListener("scroll", debounce(scrollHandle))
  })

  onUnmounted(() => {
    document.removeEventListener("scroll", scrollHandle)
  })

  const scrollHandle = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight

    isScrollToBottom.value = scrollTop + windowHeight >= scrollHeight - distance
  }

  return { isScrollToBottom }
}
