<script setup lang="ts">
import type { ICreateMovie } from '~/schemas/movie.chema'
import { apiMovie } from '~/services'
import normalizedParamss from '~/utils/normalizedParams'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
const toast = useToast()
const { t } = useI18n()

const isOpen = ref(false)
const isProcessing = ref(false)

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
  </div>
</template>
