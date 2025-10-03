<script setup lang="ts">
import { addGenre, type IFormGenre } from '~/schemas/genre.schema'
import { apiGenre } from '~/services'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
const { t } = useI18n()

const { schema } = useSchema(addGenre)
const isOpen = ref(false)
const formRef = ref()
const toast = useToast()

const form = ref<IFormGenre>({
  genreName: ''
})
const handleAdd = async (isOpenModal: boolean = false) => {
  if (isOpenModal) {
    isOpen.value = true
  } else {
    const { message } = await apiGenre.addGenre(form.value.genreName)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isOpen.value = false
  }
}

const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit()
  }
}
const canSubmit = computed(() => {
  return !form.value.genreName
})
</script>

<template>
  <div class="space-y-4">
    <MoviesTabs />
    <div class="p-4 dark:bg-bg-primary-dark bg-bg-light rounded-2xl mr-6">
      <GenreFilter @add="handleAdd" />
    </div>
    <UModal v-model:open="isOpen" title="Thêm mới">
      <template #body>
        <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="handleAdd(false)">
          <UFormField label="Tên thể loại" name="genreName">
            <UInput
              v-model="form.genreName"
              placeholder="Nhập tên thể loại phim"
              :ui="{ base: 'h-10' }"
              class="w-full"
              @keyup.enter="submitForm"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <BaseButton text="Thêm mới" variant="solid" class-name="rounded " :is-disable="canSubmit" @click="submitForm" />
        </div>
      </template>
    </UModal>
  </div>
</template>
