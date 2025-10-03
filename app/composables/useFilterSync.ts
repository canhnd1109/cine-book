export interface ApplyOptions {
  replace?: boolean
  debounce?: boolean
  resetPage?: boolean
  skipRouter?: boolean
}

export function useFilterSync<T>(
  queryToFilters: (q: Record<string, any>) => T,
  filtersToQuery: (f: T) => Record<string, any>,
  debounceMs = 400
) {
  const route = useRoute()
  const router = useRouter()

  const state = ref<T>(queryToFilters(route.query as any)) as { value: T }
  const debounceId = ref<ReturnType<typeof setTimeout> | null>(null)

  watch(
    () => route.query,
    q => {
      state.value = queryToFilters(q as any)
    },
    { immediate: true }
  )

  async function apply(patch: Partial<T>, opts: ApplyOptions = {}) {
    const replace = opts.replace ?? true
    const resetPage = opts.resetPage ?? true
    const useDebounce = opts.debounce ?? false
    const skipRouter = opts.skipRouter ?? false

    const next: T = { ...state.value, ...patch }

    if (resetPage && (next as any).page !== undefined) {
      ;(next as any).page = 1
    }

    state.value = next

    if (skipRouter) {
      return
    }

    const doUpdate = () => router[replace ? 'replace' : 'push']({ query: filtersToQuery(next) })

    if (useDebounce) {
      if (debounceId.value) clearTimeout(debounceId.value)
      debounceId.value = setTimeout(() => doUpdate(), debounceMs)
    } else {
      await doUpdate()
    }
  }

  const filters = computed(() => state.value)

  return {
    filters,
    apply
  }
}
