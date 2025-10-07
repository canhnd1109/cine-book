import { apiGenre, apiShared } from '~/services'
import type { IGenre } from '~/types/genre.type'

export const useBaseStore = defineStore('base', () => {
  const genres = ref<IGenre[]>([])
  const isFetched = ref(false)

  const fetchAllGenre = async () => {
    if (isFetched.value && genres.value.length) return

    const { data } = await useAsyncData('genres', () => apiShared.fetchAllGenre(), {
      server: true,
      lazy: true
    })

    if (data.value) {
      genres.value = data.value.value
      isFetched.value = true
    }
  }

  return {
    genres,
    fetchAllGenre
  }
})
