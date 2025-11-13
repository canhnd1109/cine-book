<script setup lang="ts">
import { apiCinema, apiPublic } from '~/services'
import type { IFormState } from '~/types/cinema.type'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
const { cinameDetail } = useCinemaData()
const isOpen = ref(false)
const toast = useToast()
const { t } = useI18n()
const isProcessing = ref(false)
const isEditMode = ref(false)
const modalAddRef = ref()
const isConfirmOpen = ref(false)

const { filters, cinemas, setRefreshCallback } = useCinemaData()

const {
  data,
  pending: isFetching,
  refresh
} = await useAsyncData('cinemas-list', async () => {
  const res = await apiPublic.fetchCinemas(filters.value)
  return res.value
})

watchEffect(() => {
  cinemas.value = data.value || []
})

setRefreshCallback(refresh)

const handleAdd = async (isOpenModal: boolean = false, form: IFormState) => {
  if (isOpenModal) {
    isEditMode.value = false
    modalAddRef.value?.resetForm()
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
      await refresh()
    } catch (error) {
      console.log(error)
    } finally {
      isProcessing.value = false
    }
  }
}

const handleEdit = async (isOpenModal: boolean = false, form: IFormState) => {
  if (isOpenModal) {
    isEditMode.value = true
    isOpen.value = true
  } else {
    const fd = useFormData(form)
    isProcessing.value = true
    try {
      const { message } = await apiCinema.editCinema(cinameDetail.value.id, fd)
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
const handleDelete = async () => {
  isProcessing.value = true
  try {
    const { message } = await apiCinema.deleteCinema(cinameDetail.value.id)
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
  }
}
</script>
<template>
  <div class="card-box">
    <CinemaFilter @add="handleAdd" />
    <CinemaModalAdd
      ref="modalAddRef"
      v-model:is-open="isOpen"
      :is-processing="isProcessing"
      :is-edit-mode="isEditMode"
      @add="handleAdd"
      @edit="handleEdit"
    />
    <CinemaList :is-fetching="isFetching" @edit="handleEdit" @delete="isConfirmOpen = true" />
    <BaseConfirmModal
      v-model:open="isConfirmOpen"
      variant="danger"
      :title="t('delete-cinema-title')"
      :description="formatConfirmContent(t('delete-cinema-confirm', { name: cinameDetail.name }), cinameDetail.name)"
      :confirm-text="t('delete')"
      :cancel-text="t('cancel-button')"
      :is-loading="isProcessing"
      @confirm="handleDelete"
    />
  </div>
</template>

<style scoped></style>
