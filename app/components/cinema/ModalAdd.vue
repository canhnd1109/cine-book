<script setup lang="ts">
import { MAX_FILES, MAX_SIZE_IMAGE_UPLOAD } from '~/constants'
import { createCinemaSchema, type IFormCinema } from '~/schemas/cinema.chema'

const { t } = useI18n()

const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const { schema } = useSchema(createCinemaSchema)

const form = ref<IFormCinema>({
  name: '',
  province: '',
  commune: '',
  detailAddress: '',
  phone: '',
  description: '',
  files: []
})

const emit = defineEmits<{
  add: [value: boolean, form: IFormCinema]
}>()

const uploadError = ref('')

const handleFileSelect = (files: File[]) => {
  uploadError.value = ''

  const limitedFiles = files.slice(0, MAX_FILES)

  if (files.length > MAX_FILES) {
    uploadError.value = t('max-files-exceeded-warning', { max: MAX_FILES, selected: files.length })
  }

  const oversizedFiles = limitedFiles.filter(file => file.size > MAX_SIZE_IMAGE_UPLOAD)
  if (oversizedFiles.length > 0) {
    uploadError.value = t('file-size-exceeded', { max: '5MB' })
    nextTick(() => {
      form.value.files = []
    })
    return
  }

  form.value.files = limitedFiles
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('add-cinema')" class="!w-[1000px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="emit('add', false, form)">
        <UFormField name="files">
          <UFileUpload
            v-model="form.files"
            accept="image/*"
            multiple
            :label="t('drop-your-images-here')"
            :description="t('description-upload-multiple-images')"
            class="w-full"
            @update:model-value="val => handleFileSelect(val ?? [])"
          />

          <!-- Error message -->
          <p v-if="uploadError" class="text-red-500 text-sm mt-2">
            {{ uploadError }}
          </p>
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="t('cinema-name')" name="name">
            <UInput v-model="form.name" :placeholder="t('cinema-name')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>

          <UFormField :label="t('phone')" name="phone">
            <UInput v-model="form.phone" :placeholder="t('phone')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>

          <UFormField :label="t('province')" name="province">
            <UInput v-model="form.province" :placeholder="t('province')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>

          <UFormField :label="t('commune')" name="commune">
            <UInput v-model="form.commune" :placeholder="t('commune')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>
        </div>

        <UFormField :label="t('detail-address')" name="detailAddress">
          <UInput v-model="form.detailAddress" :placeholder="t('detail-address')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>

        <UFormField :label="t('description')" name="description">
          <UTextarea v-model="form.description" :placeholder="t('description')" :rows="4" class="w-full" />
        </UFormField>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped></style>
