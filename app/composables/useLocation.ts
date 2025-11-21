import type { IProvince, IWardOfProvince } from '~/types/location.types'

export const useLocation = () => {
  const runtimeConfig = useRuntimeConfig()

  const getProvinces = () => {
    return useAsyncData<IProvince[]>(
      'location:provinces',
      () =>
        $fetch(`${runtimeConfig.public.baseApiUrlLocation}/`, {
          method: 'GET'
        }),
      {
        getCachedData: key => {
          const nuxtApp = useNuxtApp()
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        }
      }
    )
  }

  const getWards = (districtCode: number | Ref<number>) => {
    const code = unref(districtCode)

    return useAsyncData(
      `location:communes:${code}`,
      async () => {
        if (!code) return []

        const response = await $fetch<IWardOfProvince>(`${runtimeConfig.public.baseApiUrlLocation}/p/${code}`, {
          method: 'GET',
          query: { depth: 2 }
        })

        return response.wards || []
      },
      {
        getCachedData: key => {
          const nuxtApp = useNuxtApp()
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        },
        immediate: !!code
      }
    )
  }

  const clearCache = () => {
    const nuxtApp = useNuxtApp()

    Object.keys(nuxtApp.payload.data).forEach(key => {
      if (key.startsWith('location:')) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete nuxtApp.payload.data[key]
      }
    })
  }

  const clearProvinceCache = (provinceCode: number) => {
    const nuxtApp = useNuxtApp()
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete nuxtApp.payload.data[`location:districts:${provinceCode}`]
  }

  const refreshCommunes = async (districtCode: number) => {
    const nuxtApp = useNuxtApp()
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete nuxtApp.payload.data[`location:communes:${districtCode}`]
    return await getWards(districtCode)
  }

  return {
    getProvinces,
    getWards,
    clearCache,
    clearProvinceCache,
    refreshCommunes
  }
}
