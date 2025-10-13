<script setup lang="ts">
import { MAX_FILES, MAX_SIZE_IMAGE_UPLOAD } from '~/constants'
import { createCinemaSchema } from '~/schemas/cinema.chema'
import type { IWard } from '~/types/location.types'
import { until } from '@vueuse/core'
import type { IFormState } from '~/types/cinema.type'

const { t } = useI18n()

const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const { schema } = useSchema(createCinemaSchema)
const { getProvinces, getWards } = useLocation()

const { data: provinces, pending: loadingProvinces } = getProvinces()

const wards = ref<IWard[]>([])
const loadingWards = ref(false)
const formRef = ref()

const { isProcessing = false } = defineProps<{
  isProcessing?: boolean
}>()

const form = ref<IFormState>({
  name: '',
  province: '',
  commune: '',
  // district: 'string',
  detailAddress: '',
  phone: '',
  description: '',
  files: []
})

const emit = defineEmits<{
  add: [value: boolean, form: IFormState]
}>()

const uploadError = ref('')

watch(
  () => form.value.province,
  async newProvinceCode => {
    form.value.commune = ''
    wards.value = []

    if (newProvinceCode) {
      loadingWards.value = true
      try {
        const { data, pending } = getWards(Number(newProvinceCode))

        await until(pending).toBe(false)

        wards.value = data.value || []
      } catch (error) {
        console.error('Error loading wards:', error)
        wards.value = []
      } finally {
        loadingWards.value = false
      }
    }
  }
)

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

const provinceOptions = computed(() => {
  if (!provinces.value) return []
  return provinces.value.map(p => ({
    label: p.name,
    value: p.code,
    ...p
  }))
})

const wardOptions = computed(() => {
  return wards.value.map(w => ({
    label: w.name,
    value: w.code,
    ...w
  }))
})
const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit()
  }
}

const canSubmit = computed(() => {
  return (
    form.value.commune &&
    form.value.name &&
    form.value.description &&
    form.value.detailAddress &&
    form.value.files.length &&
    form.value.phone &&
    form.value.province
  )
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('add-cinema')" class="!w-[1000px]">
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="emit('add', false, form)">
        <!-- File Upload -->
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

          <p v-if="uploadError" class="text-red-500 text-sm mt-2">
            {{ uploadError }}
          </p>
        </UFormField>

        <!-- Cinema Name & Phone -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="t('cinema-name')" name="name">
            <UInput v-model="form.name" :placeholder="t('cinema-name')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>

          <UFormField :label="t('phone')" name="phone">
            <UInput v-model="form.phone" :placeholder="t('phone')" :ui="{ base: 'h-10' }" class="w-full" />
          </UFormField>

          <UFormField :label="t('province')" name="province">
            <BaseSelect
              v-model="form.province"
              :items="provinceOptions"
              label-key="label"
              value-key="value"
              :placeholder="t('select-province')"
              :disabled="loadingProvinces"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('ward')" name="commune">
            <BaseSelect
              v-model="form.commune"
              :items="wardOptions"
              label-key="label"
              value-key="value"
              :placeholder="t('select-ward')"
              :disabled="!form.province || loadingWards || wardOptions.length === 0"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Detail Address -->
        <UFormField :label="t('detail-address')" name="detailAddress">
          <UInput v-model="form.detailAddress" :placeholder="t('detail-address')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>

        <!-- Description -->
        <UFormField :label="t('description')" name="description">
          <UTextarea v-model="form.description" :placeholder="t('description')" :rows="4" class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end w-full">
        <BaseButton
          :text="t('add')"
          class="w-20"
          variant="solid"
          class-name="rounded "
          :is-loading="isProcessing"
          :is-disable="!canSubmit"
          @click="submitForm"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
