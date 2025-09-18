/* eslint-disable  @typescript-eslint/no-explicit-any */
export function useSchema<T extends (t: (key: string) => string, ...args: any[]) => any>(createSchemaFn: T) {
  const { t } = useI18n()

  const getSchema = (...args: Parameters<T> extends [any?, ...any[]] ? Tail<Parameters<T>> : never) =>
    createSchemaFn(t, ...(args as any))

  const schema = computed(() => createSchemaFn(t))

  return { getSchema, schema }
}

type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never
