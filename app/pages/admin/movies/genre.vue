<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { addGenre, type IFormGenre } from '~/schemas/genre.schema'
import { apiGenre } from '~/services'
import type { IGenre } from '~/types/genre.type'
import { useGenreData } from './useGenre'
import type { IResponseData } from '~/types/response.type'

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

const { filters, genres, setRefreshCallback } = useGenreData()

const {
  data,
  pending: isFetching,
  refresh
} = await useAsyncData('genres-list', async () => {
  const res = await apiGenre.fetchGenre(filters.value)
  return res.value
})
genres.value = data.value || []

setRefreshCallback(refresh)

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

const columns: TableColumn<IGenre>[] = [
  {
    accessorKey: 'stt',
    header: 'STT',
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: 'name',
    header: t('genre-name')
  }
]
</script>

<template>
  <div class="card-box">
    <MoviesTabs />
    <div class="rounded-lg">
      <GenreFilter @add="handleAdd" />
      <UTable ref="table" :data="genres" :columns="columns" :loading="isFetching" />
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
