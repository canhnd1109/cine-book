<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { createGenreSchema, type IFormGenre } from '~/schemas/genre.schema'
import { apiGenre, apiPublic } from '~/services'
import type { IGenre } from '~/types/genre.type'
import { useGenreData } from '../../../composables/useGenre'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t } = useI18n()

const { schema } = useSchema(createGenreSchema)
const isOpen = ref(false)
const formRef = ref()
const toast = useToast()
const isProcessing = ref(false)
const isEditMode = ref(false)
const genreId = ref('')
const genreName = ref('')
const isConfirmOpen = ref(false)
const isDeleting = ref(false)

const form = ref<IFormGenre>({
  genreName: ''
})

const { filters, genres, setRefreshCallback } = useGenreData()

const {
  data,
  pending: isFetching,
  refresh
} = await useAsyncData('genres-list', async () => {
  const res = await apiPublic.fetchGenre(filters.value)
  return res.value
})

watchEffect(() => {
  genres.value = data.value || []
})

setRefreshCallback(refresh)

const handleAction = async (isOpenModal: boolean = false) => {
  if (isOpenModal) {
    isOpen.value = true
  } else {
    isProcessing.value = true
    try {
      const { message } = isEditMode.value
        ? await apiGenre.updateGenre(genreId.value, form.value.genreName)
        : await apiGenre.createGenre(form.value.genreName)
      toast.add({
        title: t('success'),
        description: message,
        color: 'success'
      })
      form.value.genreName = ''
      isOpen.value = false
      isEditMode.value = false
      await refresh()
    } catch (error) {
      console.log(error)
    } finally {
      isProcessing.value = false
    }
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
  },
  {
    id: 'action'
  }
]

function getDropdownActions(row: IGenre): DropdownMenuItem[][] {
  // const isDeleting = deletingGenreId.value === row.id

  return [
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        onSelect: () => {
          isOpen.value = true
          isEditMode.value = true
          form.value.genreName = row.name
          genreId.value = row.id
        }
      },
      {
        label: isDeleting.value ? t('deleting') + '...' : t('delete'),
        icon: isDeleting.value ? 'i-lucide-loader spin' : 'i-lucide-trash',
        color: 'error',
        disabled: isDeleting.value,
        onSelect: async () => {
          isConfirmOpen.value = true
          genreId.value = row.id
          genreName.value = row.name
        }
      }
    ]
  ]
}

const handleDelete = async () => {
  if (!genreId.value) return
  isDeleting.value = true
  try {
    const { message } = await apiGenre.deleteGenre(genreId.value)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isConfirmOpen.value = false
    await refresh()
  } catch (error) {
    console.log(error)
  } finally {
    isDeleting.value = false
    genreId.value = ''
  }
}
</script>

<template>
  <div class="card-box">
    <MoviesTabs />
    <div class="rounded-lg">
      <GenreFilter @add="handleAction" />
      <UTable ref="table" :data="genres" :columns="columns" :loading="isFetching">
        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)" :ui="{ itemLabel: 'cursor-pointer' }">
            <!-- deletingGenreId === row.original.id ? 'i-lucide-loader animate-spin' : -->
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="ghost"
              aria-label="Actions"
              class="hover:cursor-pointer"
            />
          </UDropdownMenu>
        </template>
      </UTable>
    </div>
    <UModal v-model:open="isOpen" :title="isEditMode ? t('edit-genre') : t('add-genre')" class="w-[600px]">
      <template #body>
        <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="handleAction(false)">
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
            :text="isEditMode ? t('edit') : t('add')"
            :is-loading="isProcessing"
            variant="solid"
            class-name="rounded "
            :is-disable="canSubmit"
            @click="submitForm"
          />
        </div>
      </template>
    </UModal>
    <BaseConfirmModal
      v-model:open="isConfirmOpen"
      variant="danger"
      :title="t('delete-genre-title')"
      :description="formatConfirmContent(t('delete-genre-confirm', { name: genreName }), genreName)"
      :confirm-text="t('delete')"
      :cancel-text="t('cancel-button')"
      :is-loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>
