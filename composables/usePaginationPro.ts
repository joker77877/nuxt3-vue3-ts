import type { Opts } from "@/composables/useMyRequest"

/**
 * @description 自动分页的useMyRequest
 * @param {Function} requestFn 接口请求函数，返回Promise<{ total: number; list: T }>
 * */
export const usePaginationPro = <T extends unknown[]>(
  requestFn: (page: ReqPage) => Promise<{ total: number; list: T }>,
  opts?: Opts<T> & {
    pageSize?: number
  }
) => {
  const paging = reactive({
    pageSize: opts?.pageSize || 10,
    pageNo: 1,
    total: 0
  })

  const { data, mutate, run, ...restReturns } = useMyRequest(
    () =>
      requestFn({
        // 当前页数
        pageNo: paging.pageNo,
        // 每页显示条数
        pageSize: paging.pageSize
      }).then((res) => {
        paging.total = res.total || 0
        return res.list || []
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

  watch([() => paging.pageNo, () => paging.pageSize], () => {
    run()
  })

  return {
    run,
    data,
    reset,
    paging,
    ...restReturns
  }
}
