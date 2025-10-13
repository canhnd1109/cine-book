<script setup lang="ts">
import { apiCinema } from '~/services'
import type { IFormState } from '~/types/cinema.type'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
const isOpen = ref(false)
const toast = useToast()
const { t } = useI18n()
const isProcessing = ref(false)

const handleAdd = async (isOpenModal: boolean = false, form: IFormState) => {
  if (isOpenModal) {
    isOpen.value = true
  } else {
    const fd = useFormData(form)
    isProcessing.value = true
    try {
      const { message } = await apiCinema.addCinema(fd)
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
    <CinemaFilter @add="handleAdd" />
    <CinemaModalAdd v-model:is-open="isOpen" :is-processing="isProcessing" @add="handleAdd" />
  </div>
</template>

<style scoped></style>
