export type CoerceKind = 'number' | 'boolean' | 'string' | ((v: any) => any)

interface CreateFilterSyncOptions<T> {
  defaults: T
  mapping: Record<string, string>
  debounceMs?: number
  coerce?: Record<string, CoerceKind>
}

function getByPath(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}

function setByPath(obj: any, path: string, value: any) {
  const keys = path.split('.')
  let cur = obj
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cur[k] = value
    } else {
      const v = cur[k]
      if (v === null || v === undefined || typeof v !== 'object' || Array.isArray(v)) {
        cur[k] = {}
      }
      cur = cur[k]
    }
  })
}

function firstDefined(v: any) {
  if (Array.isArray(v)) return v.find(e => e != null && e !== '') ?? undefined
  return v
}

function toNumber(v: any): number | undefined {
  const x = firstDefined(v)
  if (x === '' || x === undefined || x === null) return undefined
  const n = Number(x)
  return Number.isFinite(n) ? n : undefined
}

function toBoolean(v: any): boolean | undefined {
  const x = String(firstDefined(v)).trim().toLowerCase()
  if (x === 'true' || x === '1' || x === 'yes' || x === 'on') return true
  if (x === 'false' || x === '0' || x === 'no' || x === 'off') return false
  return undefined
}

function applyCoerce(v: any, kind?: CoerceKind) {
  if (kind === 'number') return toNumber(v)
  if (kind === 'boolean') return toBoolean(v)
  if (kind === 'string') {
    const x = firstDefined(v)
    return x == null ? undefined : String(x)
  }
  if (typeof kind === 'function') return kind(v)
  return firstDefined(v)
}

export function createFilterSync<T extends Record<string, any>>(options: CreateFilterSyncOptions<T>) {
  const { defaults, mapping, debounceMs = 400, coerce = {} } = options

  function filtersToQuery(f: T): Record<string, any> {
    const q: Record<string, any> = {}
    for (const path in mapping) {
      const queryKey = mapping[path] ?? path
      const val = getByPath(f, path)
      if (val !== undefined && val !== null && !(typeof val === 'string' && val.trim() === '') && val !== 0) {
        q[queryKey] = val
      }
    }
    return q
  }

  function queryToFilters(q: Record<string, any>): T {
    const f: T = structuredClone(defaults)
    for (const path in mapping) {
      const queryKey = mapping[path] ?? path
      if (q[queryKey] !== undefined) {
        const coerced = applyCoerce(q[queryKey], coerce[path])
        if (coerced !== undefined) {
          setByPath(f, path, coerced)
        }
      }
    }
    return f
  }

  return () => useFilterSync<T>(queryToFilters, filtersToQuery, debounceMs)
}
