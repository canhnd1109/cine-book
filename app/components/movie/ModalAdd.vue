<script setup lang="ts">
import { MAX_SIZE_IMAGE_UPLOAD } from '~/constants'
import { createMovieSchema, type ICreateMovie } from '~/schemas/movie.chema'

const { genres } = storeToRefs(useBaseStore())
const { movieDetail } = useMovieData()

const isOpen = defineModel('isOpen', { type: Boolean, default: false })

const { t } = useI18n()
const { schema } = useSchema(createMovieSchema)

const props = defineProps<{
  isProcessing?: boolean
  isEditMode?: boolean
}>()

const formRef = ref()

const form = ref<ICreateMovie>({
  director: '',
  performer: '',
  description: '',
  releaseDate: '',
  closeDate: '',
  nation: '',
  duration: '',
  note: '',
  price: 0,
  trailerUrl: '',
  posterFile: null,
  name: '',
  genreIds: []
})

const uploadError = ref<string>('')

const emit = defineEmits<{
  add: [value: boolean, form: ICreateMovie]
  edit: [value: boolean, form: ICreateMovie]
}>()

watch(
  () => movieDetail.value,
  newData => {
    if (newData && props.isEditMode) {
      form.value = {
        director: newData.director || '',
        performer: newData.performer || '',
        description: newData.description || '',
        releaseDate: newData.releaseDate,
        closeDate: newData.closeDate,
        nation: newData.nation || '',
        duration: newData.duration?.toString() || '',
        note: newData.note || '',
        price: newData.price || 0,
        trailerUrl: newData.trailerUrl || '',
        posterFile: null,
        name: newData.name || '',
        genreIds: newData.genres || []
      }
    }
  },
  { immediate: true }
)

// Reset form khi đóng modal
watch(isOpen, newValue => {
  if (!newValue && !props.isEditMode) {
    form.value = {
      director: '',
      performer: '',
      description: '',
      releaseDate: '',
      closeDate: '',
      nation: '',
      duration: '',
      note: '',
      price: 0,
      trailerUrl: '',
      posterFile: null,
      name: '',
      genreIds: []
    }
    uploadError.value = ''
  }
})

const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit()
  }
}

const handleSubmit = () => {
  if (props.isEditMode) {
    emit('edit', false, form.value)
  } else {
    emit('add', false, form.value)
  }
}
const dateReleaseInput = ref<{ $el?: HTMLElement } | null>(null)
const dateCloseInput = ref<{ $el?: HTMLElement } | null>(null)

const handleReleaseDateClick = () => {
  focusDateInput(dateReleaseInput)
}

const handleCloseDateClick = () => {
  focusDateInput(dateCloseInput)
}

const handleFileSelect = (file: File | null | undefined) => {
  uploadError.value = ''

  if (!file) {
    form.value.posterFile = null
    return
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    uploadError.value = t('invalid-file-type')
    form.value.posterFile = null
    return
  }

  if (file.size > MAX_SIZE_IMAGE_UPLOAD) {
    uploadError.value = t('file-too-large')
    form.value.posterFile = null
    return
  }

  form.value.posterFile = file
}

const canSubmit = computed(() => {
  // Khi edit, posterFile không bắt buộc (giữ nguyên poster cũ nếu không upload mới)
  const posterValid = props.isEditMode ? true : !!form.value.posterFile

  return (
    posterValid &&
    form.value.name &&
    form.value.performer &&
    form.value.description &&
    form.value.releaseDate &&
    form.value.closeDate &&
    form.value.nation &&
    form.value.duration &&
    form.value.price &&
    form.value.trailerUrl &&
    form.value.genreIds.length
  )
})

const formattedPrice = computed({
  get: () => {
    if (!form.value.price) return 0
    return new Intl.NumberFormat('vi-VN').format(+form.value.price)
  },
  set: (value: string) => {
    const numberValue = value.replace(/[^\d]/g, '')
    form.value.price = numberValue ? parseInt(numberValue) : 0
  }
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="isEditMode ? t('edit-movie') : t('add-movie')" class="!w-[1000px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="handleSubmit">
        <UFormField class="flex justify-center items-center" name="posterFile">
          <div class="w-full">
            <UFileUpload
              v-model="form.posterFile"
              accept="image/*"
              :label="t('drop-your-image-here')"
              :description="t('description-upload-image')"
              class="w-96 min-h-48 mx-auto"
              @update:model-value="handleFileSelect"
            />

            <!-- Error message -->
            <p v-if="uploadError" class="text-red-500 text-sm text-center mt-2">
              {{ uploadError }}
            </p>
          </div>
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="t('movie-name')" name="name">
            <UInput v-model="form.name" :placeholder="t('movie-name')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
          <UFormField :label="t('movie-duration')" name="duration">
            <UInput v-model="form.duration" :placeholder="t('movie-duration')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
          <UFormField :label="t('director-name')" name="director">
            <UInput v-model="form.director" :placeholder="t('enter-director-movie-name')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
          <UFormField :label="t('performer-name')" name="performer">
            <UInput
              v-model="form.performer"
              :placeholder="t('enter-performer-movie-name')"
              :ui="{ base: 'h-10' }"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('release-date')" name="releaseDate">
            <UInput
              ref="dateReleaseInput"
              v-model="form.releaseDate"
              type="datetime-local"
              :placeholder="t('choose-release-date')"
              :ui="{ base: 'h-10', root: 'w-full' }"
              class="w-full"
              @click="handleReleaseDateClick"
            />
          </UFormField>
          <UFormField :label="t('close-date')" name="closeDate">
            <UInput
              ref="dateCloseInput"
              v-model="form.closeDate"
              type="datetime-local"
              :placeholder="t('choose-close-date')"
              :ui="{ base: 'h-10 w-full' }"
              class="w-full"
              @click="handleCloseDateClick"
            />
          </UFormField>

          <UFormField :label="t('nation')" name="nation">
            <UInput v-model="form.nation" :placeholder="t('nation')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
          <UFormField :label="t('price')" name="price">
            <UInput v-model="formattedPrice" :placeholder="t('price')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
        </div>
        <UFormField :label="t('genre')" name="genreIds">
          <BaseSelect
            v-model="form.genreIds"
            :items="genres"
            label-key="name"
            value-key="id"
            multiple
            :placeholder="t('genre')"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('trailer')" name="trailerUrl">
          <UInput v-model="form.trailerUrl" :placeholder="t('enter-trailer')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>
        <UFormField :label="t('description-movie')" name="description">
          <UTextarea v-model="form.description" :placeholder="t('description-movie')" class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end w-full">
        <BaseButton
          :text="isEditMode ? t('edit') : t('add')"
          class="w-20"
          :is-loading="isProcessing"
          variant="solid"
          class-name="rounded "
          :is-disable="!canSubmit"
          @click="submitForm"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
