<script setup lang="ts">
import type { ICreateMovie } from '~/schemas/movie.chema'
import { apiMovie, apiPublic } from '~/services'
import normalizedParamss from '~/utils/normalizedParams'
import { useMovieData } from '../../../composables/useMovie'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const toast = useToast()
const { t } = useI18n()

const isOpen = ref(false)
const isProcessing = ref(false)

const { filters, movies, totalRecords, setRefreshCallback } = useMovieData()

const {
  data,
  pending: isFetching,
  refresh
} = await useAsyncData('movies-list', async () => {
  const res = await apiPublic.fetchMovies(filters.value)
  return res.value
})

watchEffect(() => {
  movies.value = data.value?.content || []
  totalRecords.value = data.value?.totalElements || 0
})

const handeAddMovie = async (isOpenModal: boolean = false, formData: ICreateMovie) => {
  if (isOpenModal) {
    isOpen.value = true
  } else {
    const _fd = normalizedParamss({
      ...formData,
      releaseDate: toMidnight(formData.releaseDate),
      closeDate: toMidnight(formData.closeDate)
    })
    const fd = useFormData(_fd)
    isProcessing.value = true
    try {
      const { message } = await apiMovie.addMovie(fd)
      toast.add({
        title: t('success'),
        description: message,
        color: 'success'
      })
      isOpen.value = false
      setRefreshCallback(refresh)
    } catch (error) {
      console.log(error)
    } finally {
      isProcessing.value = false
    }
  }
}
</script>

<template>
  <div class="card-box">
    <MoviesTabs />
    <MovieFilter @add="handeAddMovie" />
    <MovieModalAdd v-model:is-open="isOpen" :is-processing="isProcessing" @add="handeAddMovie" />
    <MovieTable :is-fetching="isFetching" />
  </div>
</template>
