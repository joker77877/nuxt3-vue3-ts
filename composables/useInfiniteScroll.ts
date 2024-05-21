import { debounce } from "lodash-es"
import type { Opts } from "@/composables/useMyRequest"

/**
 * @description 滚动条滚动到底部加载数据
 * @param {Function} requestFn 获取列表数据 api 方法 (必传)
 * */
export const useInfiniteScroll = <T extends unknown[]>(
  requestFn: (page: ReqPage) => Promise<{ total: number; list: T }>,
  opts?: Opts<T> & {
    pageSize?: number
  }
) => {
  const paging = reactive({
    pageSize: opts?.pageSize || 20,
    pageNo: 1,
    total: 0
  })

  const { data, error, loading, run, mutate } = useMyRequest(
    () =>
      requestFn({
        // 当前页数
        pageNo: paging.pageNo,
        // 每页显示条数
        pageSize: paging.pageSize
      }).then((res) => {
        paging.total = res.total || 0
        const list = res.list || []
        const r: T = (paging.pageNo > 1 ? [...data.value, ...list] : list) as T
        return r
      }),
    {
      ...opts,
      initialData: [] as unknown as T
    }
  )

  const reset = () => {
    mutate([] as unknown as T)
    paging.pageNo = 1
    paging.total = 0
  }

  const handlerScroll = () => {
    if (loading.value || error.value || data.value.length === 0 || paging.total === data.value.length) return
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    // 根据distanceToBottom的值判断用户是否接近底部
    if (scrollTop + windowHeight >= scrollHeight - 300) {
      paging.pageNo += 1
      run()
    }
  }
  const debounceFun = debounce(handlerScroll, 20)
  onMounted(() => {
    document.addEventListener("scroll", debounceFun)
  })
  onUnmounted(() => {
    document.removeEventListener("scroll", debounceFun)
  })
  return {
    data,
    error,
    loading,
    run,
    reset,
    paging
  }
}
