<script setup lang="ts">
import type { ICreateMovie, ICreateShowtime } from '~/schemas/movie.chema'
import { apiMovie, apiPublic, apiShowtime } from '~/services'
import normalizedParamss from '~/utils/normalized-params'
import { useMovieData } from '../../../composables/useMovie'
import type { IActionCard } from '~/types/constant.type'
import type { IMovie } from '~/types/movie.type'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const toast = useToast()
const { t } = useI18n()
const { filters, movies, totalRecords, movieDetail, setRefreshCallback } = useMovieData()
const { fetchAllCinemas } = useCinemaData()

const isOpen = ref(false)
const isOpenModalSetting = ref(false)
const isProcessing = ref(false)
const modalRef = ref()
const isConfirmOpen = ref(false)
const isEditMode = ref(false)

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

setRefreshCallback(refresh)

const handeAddMovie = async (isOpenModal: boolean = false, formData?: ICreateMovie) => {
  if (isOpenModal) {
    isOpen.value = true
    isEditMode.value = false
  } else {
    if (!formData) return

    const _fd = normalizedParamss({
      ...formData,
      releaseDate: formatDateTime(formData.releaseDate),
      closeDate: formatDateTime(formData.closeDate)
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
      await refresh()
    } catch (error) {
      console.log(error)
    } finally {
      isProcessing.value = false
    }
  }
}

const handleEditMovie = async (_: boolean, formData?: ICreateMovie) => {
  if (!formData || !movieDetail.value) return

  const _fd = normalizedParamss({
    ...formData,
    releaseDate: formatDateTime(formData.releaseDate),
    closeDate: formatDateTime(formData.closeDate)
  })
  const fd = useFormData(_fd)
  isProcessing.value = true
  try {
    const { message } = await apiMovie.updateMovie(movieDetail.value.id, fd)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isOpen.value = false
    isEditMode.value = false
    await refresh()
  } catch (error) {
    console.log(error)
  } finally {
    isProcessing.value = false
  }
}

const handleAction = (action: IActionCard, item: IMovie) => {
  movieDetail.value = item
  if (action === 'SETTING') {
    isOpenModalSetting.value = true
  } else if (action === 'EDIT') {
    isEditMode.value = true
    isOpen.value = true
    // Handle edit action
  } else if (action === 'DELETE') {
    isConfirmOpen.value = true
  }
}

const handleSetting = async (form: ICreateShowtime) => {
  const fd = {
    ...form,
    startTime: formatDateTime(form.startTime),
    endTime: formatDateTime(form.endTime)
  }
  isProcessing.value = true
  try {
    const { message } = await apiShowtime.addShowtime(fd)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isOpenModalSetting.value = false
    modalRef.value?.resetForm()
  } catch (error) {
    console.log(error)
  } finally {
    isProcessing.value = false
  }
}

const handleDelete = async () => {
  isProcessing.value = true
  try {
    const { message } = await apiPublic.deleteMovie(movieDetail.value.id)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    await refresh()
  } catch (error) {
    console.log(error)
  } finally {
    isProcessing.value = false
    isConfirmOpen.value = false
  }
}
onMounted(() => {
  fetchAllCinemas()
})
</script>

<template>
  <div class="card-box">
    <MoviesTabs />
    <MovieFilter @add="handeAddMovie" />
    <MovieModalAdd
      v-model:is-open="isOpen"
      :is-processing="isProcessing"
      :is-edit-mode="isEditMode"
      :movie-data="movieDetail"
      @add="handeAddMovie"
      @edit="handleEditMovie"
    />
    <MovieList :is-fetching="isFetching" @action-click="handleAction" />
    <MovieModalSetting ref="modalRef" v-model="isOpenModalSetting" :is-processing="isProcessing" @setting="handleSetting" />
    <BaseConfirmModal
      v-model:open="isConfirmOpen"
      variant="danger"
      :title="t('delete-movie-title')"
      :description="formatConfirmContent(t('delete-movie-confirm', { name: movieDetail.name }), movieDetail.name)"
      :confirm-text="t('delete')"
      :cancel-text="t('cancel-button')"
      :is-loading="isProcessing"
      @confirm="handleDelete"
    />
  </div>
</template>
