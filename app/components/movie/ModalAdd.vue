<script setup lang="ts">
import { MAX_SIZE_IMAGE_UPLOAD } from '~/constants'
import { createMovieSchema, type ICreateMovie } from '~/schemas/movie.chema'
const { genres } = storeToRefs(useBaseStore())

const isOpen = defineModel('isOpen', { type: Boolean, default: false })

const { t } = useI18n()
const { schema } = useSchema(createMovieSchema)

const formRef = ref()
const isCreating = ref(false)

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
}>()

const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit()
  }
}

const dateReleaseInput = ref<HTMLInputElement | null>(null)
function focusReleaseInput() {
  const el = (dateReleaseInput.value as any)?.$el?.querySelector('input') as HTMLInputElement | null
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el?.showPicker?.() || el?.focus()
}

const dateCloseInput = ref<HTMLInputElement | null>(null)
function focusCloseInput() {
  const el = (dateCloseInput.value as any)?.$el?.querySelector('input') as HTMLInputElement | null
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el?.showPicker?.() || el?.focus()
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
  return (
    form.value.posterFile ||
    form.value.name ||
    form.value.performer ||
    form.value.description ||
    form.value.releaseDate ||
    form.value.closeDate ||
    form.value.nation ||
    form.value.duration ||
    form.value.price ||
    form.value.trailerUrl
    // !form.value.genreIds.length
  )
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('add-movie')" class="!w-[1000px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="emit('add', false, form)">
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
              @click="focusReleaseInput"
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
              @click="focusCloseInput"
            />
          </UFormField>

          <UFormField :label="t('nation')" name="nation">
            <UInput v-model="form.nation" :placeholder="t('nation')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
          <UFormField :label="t('price')" name="price">
            <UInput v-model="form.price" :placeholder="t('price')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
        </div>
        <UFormField :label="t('genre')" name="genreIds">
          <BaseSelect
            v-model="form.genreIds"
            :item="genres"
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
          :text="t('add')"
          :is-loading="isCreating"
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
