<script setup lang="ts">
import { addGenre, type IFormGenre } from '~/schemas/genre.schema'
import { apiGenre } from '~/services'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
const { t } = useI18n()

const { schema } = useSchema(addGenre)
const isOpen = ref(false)
const formRef = ref()
const toast = useToast()
const isCreating = ref(false)

const form = ref<IFormGenre>({
  genreName: ''
})
const handleAdd = async (isOpenModal: boolean = false) => {
  if (isOpenModal) {
    isOpen.value = true
  } else {
    isCreating.value = true
    const { message } = await apiGenre.addGenre(form.value.genreName)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isCreating.value = false
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
    <div class="p-4 dark:bg-bg-primary-dark bg-bg-light rounded-lg mr-6">
      <GenreFilter @add="handleAdd" />
    </div>
    <UModal v-model:open="isOpen" :title="t('add-genre')">
      <template #body>
        <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="handleAdd(false)">
          <UFormField :label="t('genre-name')" name="genreName">
            <UInput
              v-model="form.genreName"
              :placeholder="t('enter-movie-genre-name')"
              :ui="{ base: 'h-10' }"
              class="w-full"
              @keyup.enter="submitForm"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <BaseButton
            :text="t('add')"
            :is-loading="isCreating"
            variant="solid"
            class-name="rounded "
            :is-disable="canSubmit"
            @click="submitForm"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
