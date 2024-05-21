/**
 * @description 滚动条滚动到底部加载数据
 * @param {Function} api 获取列表数据 api 方法 (必传)
 * */
export const useServerInfiniteScroll = async <T, P extends object>(
  requestFn: (page: ReqPage) => ReturnType<typeof useAsyncData<T>>,
  props: P,
  pageSize = 20

  // opts?: Opts<T>
) => {
  const paging = reactive({
    pageSize,
    pageNo: 1
  })
  watch(
    () => props,
    () => {
      paging.pageNo = 1
      paging.pageSize = pageSize
    },
    { deep: true }
  )
  const { data, error, pending, refresh } = await requestFn(paging)

  const handlerScroll = (isSame: boolean) => {
    if (pending.value || error.value || isSame) return
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    // 根据distanceToBottom的值判断用户是否接近底部
    if (scrollTop + windowHeight >= scrollHeight - 300) {
      paging.pageNo += 1
      refresh()
    }
  }

  return {
    data,
    error,
    pending,
    refresh,
    paging,
    handlerScroll
  }
}
