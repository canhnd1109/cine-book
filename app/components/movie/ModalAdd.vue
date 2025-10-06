<script setup lang="ts">
import { createMovieSchema, type ICreateMovie } from '~/schemas/movie.chema'

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
  posterUrl: null,
  genreIds: []
})

const emit = defineEmits<{
  add: [value: boolean]
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
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('add-movie')" class="!w-[1000px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="emit('add', false)">
        <div class="grid grid-cols-2 gap-4">
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
              placeholder="choose-release-date"
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
        <UFormField :label="t('trailer-url')" name="trailerUrl">
          <UInput v-model="form.trailerUrl" :placeholder="t('enter-trailer-url')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>
        <UFormField :label="t('description')" name="description">
          <UTextarea v-model="form.description" :placeholder="t('enter-description-movie')" class="w-full" />
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
</template>

<style scoped></style>
