import { WatchSource, watch, onMounted, ref, Ref } from "vue"

export interface Opts<T> {
  // 是否手动执行请求
  manual?: boolean
  // 初始值
  initialData?: T
  // 监听值改变自动请求
  refreshDeps?: WatchSource<any>[]
  // 延迟loading结束时间
  loadingDelay?: number
  // 延迟loading只生效一次
  onceDelay?: boolean
}

interface Returns<P extends unknown[]> {
  run: (...rest: P) => void
  loading: Ref<boolean>
  error: Ref<Error | undefined>
  refresh: () => void
}

function useMyRequest<T, P extends unknown[]>(
  requestFn: (...rest: P) => Promise<T>,
  options?: Omit<Opts<T>, "initialData">
): Returns<P> & {
  data: Ref<T | undefined>
  mutate: (v: T | undefined) => void
}
function useMyRequest<T, P extends unknown[]>(
  requestFn: (...rest: P) => Promise<T>,
  options?: Opts<T>
): Returns<P> & {
  data: Ref<T>
  mutate: (v: T) => void
}
function useMyRequest<T, P extends unknown[]>(requestFn: (...rest: P) => Promise<T>, options: Opts<T> = {}) {
  let { manual = false, initialData, refreshDeps = [], loadingDelay, onceDelay = false } = options
  const data = ref<T | undefined>()
  data.value = initialData
  const loading = ref(false)
  const error = ref<Error>()
  let prevParams = [] as unknown as P

  const run = (...rest: P) => {
    loading.value = true
    const startTime = Date.now()
    prevParams = rest
    requestFn(...rest)
      .then<T>((res) => {
        if (isNumber(loadingDelay)) {
          const diff = loadingDelay - (Date.now() - startTime)
          if (onceDelay) {
            loadingDelay = undefined
          }
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), diff > 0 ? diff : 0)
          })
        }
        return res
      })
      .then((res) => {
        data.value = res
        return res
      })
      .catch((e) => {
        error.value = e
      })
      .finally(() => {
        loading.value = false
      })
  }

  const mutate = (v: typeof data.value) => {
    data.value = v
  }

  const refresh = () => {
    run(...prevParams)
  }

  onMounted(() => {
    if (!manual) {
      run(...([] as unknown as P))
    }
  })

  if (refreshDeps.length > 0) {
    watch(refreshDeps, () => run(...([] as unknown as P)))
  }

  return {
    data,
    run,
    loading,
    mutate,
    error,
    refresh
  }
}

export default useMyRequest
