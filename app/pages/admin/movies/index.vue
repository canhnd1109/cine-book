<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin'] })

const isOpen = ref(false)

const handeAddMovie = (isOpenModal: boolean = false) => {
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
    <MovieModalAdd v-model:is-open="isOpen" />
  </div>
</template>
