<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin'] })
const isOpen = ref(false)

const handleAdd = async (isOpenModal: boolean = false) => {
  if (isOpenModal) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}
</script>
<template>
  <div class="card-box">
    <CinemaFilter @add="handleAdd" />
    <CinemaModalAdd v-model:is-open="isOpen" @add="handleAdd" />
  </div>
</template>

<style scoped></style>
