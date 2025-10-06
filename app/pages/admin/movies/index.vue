<script setup lang="ts">
import type { ICreateMovie } from '~/schemas/movie.chema'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const isOpen = ref(false)

const handeAddMovie = (isOpenModal: boolean = false, formData: ICreateMovie) => {
  console.log('🚀 ~ handeAddMovie ~ formData:', formData)
  if (isOpenModal) {
    isOpen.value = true
  } else {
    console.log('object')
  }
}
</script>

<template>
  <div class="card-box">
    <MoviesTabs />
    <MovieFilter @add="handeAddMovie" />
    <MovieModalAdd v-model:is-open="isOpen" @add="handeAddMovie" />
  </div>
</template>
