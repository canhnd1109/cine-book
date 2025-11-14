<script setup lang="ts">
import { MAX_FILES, MAX_SIZE_IMAGE_UPLOAD } from '~/constants'
import { createCinemaSchema } from '~/schemas/cinema.chema'
import type { IWard } from '~/types/location.types'
import { until } from '@vueuse/core'
import type { IFormState } from '~/types/cinema.type'

const { t } = useI18n()

const { schema } = useSchema(createCinemaSchema)
const { getProvinces, getWards } = useLocation()
const { cinameDetail } = useCinemaData()

const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const wards = ref<IWard[]>([])
const loadingWards = ref(false)
const formRef = ref()

const { data: provinces, pending: loadingProvinces } = getProvinces()

const { isProcessing = false, isEditMode = false } = defineProps<{
  isProcessing?: boolean
  isEditMode?: boolean
}>()

const form = ref<IFormState>({
  name: '',
  province: '',
  commune: '',
  detailAddress: '',
  phone: '',
  description: '',
  files: []
})

const existingImages = ref<string[]>([])

const selectedProvinceName = computed(() => {
  return provinceOptions.value.find((p: { label: string; value: number }) => p.value === Number(form.value.province))?.label || ''
})

const selectedWardName = computed(() => {
  return wardOptions.value.find((w: { label: string; value: number }) => w.value === Number(form.value.commune))?.label || ''
})

const provinceModel = computed({
  get: () => Number(form.value.province) || undefined,
  set: (val: number | undefined) => {
    form.value.province = val ? String(val) : ''
  }
})

const communeModel = computed({
  get: () => Number(form.value.commune) || undefined,
  set: (val: number | undefined) => {
    form.value.commune = val ? String(val) : ''
  }
})

const emit = defineEmits<{
  add: [value: boolean, form: IFormState]
  edit: [value: boolean, form: IFormState]
}>()

const uploadError = ref('')

const getProvinceCodeByName = (provinceName: string) => {
  return provinceOptions.value.find((p: { label: string; value: number }) => p.label === provinceName)?.value || ''
}

const getWardCodeByName = (wardName: string) => {
  return wardOptions.value.find((w: { label: string; value: number }) => w.label === wardName)?.value || ''
}

watch(
  [isOpen, () => isEditMode, cinameDetail],
  async ([open, editMode, detail]) => {
    if (open && editMode && detail) {
      const cinema = detail

      existingImages.value = cinema.urlImages || []

      await until(loadingProvinces).toBe(false)

      await nextTick()
      const provinceCode = getProvinceCodeByName(cinema.province)
      if (provinceCode) {
        form.value.province = String(provinceCode)
      }

      if (provinceCode) {
        loadingWards.value = true
        try {
          const { data, pending } = getWards(Number(provinceCode))
          await until(pending).toBe(false)
          wards.value = data.value || []

          await nextTick()
          const wardCode = getWardCodeByName(cinema.commune)
          if (wardCode) {
            form.value.commune = String(wardCode)
          }
        } catch (error) {
          console.error('Error loading wards:', error)
        } finally {
          loadingWards.value = false
        }
      }

      form.value.name = cinema.name
      form.value.detailAddress = cinema.detailAddress
      form.value.phone = cinema.phone
      form.value.description = cinema.description
      form.value.files = []
    } else if (open && !editMode) {
      resetForm()
    }
  },
  { immediate: true }
)

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

const onSubmit = () => {
  if (isEditMode) {
    emit('edit', false, getFormDataWithLabels())
  } else {
    emit('add', false, getFormDataWithLabels())
  }
}

const canSubmit = computed(() => {
  const hasImages = isEditMode ? existingImages.value.length > 0 || form.value.files.length > 0 : form.value.files.length > 0

  return (
    form.value.commune &&
    form.value.name &&
    form.value.description &&
    form.value.detailAddress &&
    hasImages &&
    form.value.phone &&
    form.value.province
  )
})

const getFormDataWithLabels = () => {
  return {
    ...form.value,
    province: selectedProvinceName.value,
    commune: selectedWardName.value
  }
}
const resetForm = () => {
  form.value = {
    name: '',
    province: '',
    commune: '',
    detailAddress: '',
    phone: '',
    description: '',
    files: []
  }
  wards.value = []
  existingImages.value = []
}
defineExpose({
  resetForm
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="isEditMode ? t('edit-cinema') : t('add-cinema')"
    class="w-[1000px]"
    @close:prevent="resetForm"
  >
    <template #body>
      <UForm ref="formRef" :schema :state="form" class="space-y-4" @submit="onSubmit">
        <!-- Existing Images (Edit mode) -->
        <div v-if="isEditMode && existingImages.length > 0" class="space-y-2">
          <label class="block text-sm font-medium">{{ t('current-images') }}</label>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="(img, index) in existingImages" :key="index" class="relative">
              <img :src="img" :alt="`Image ${index + 1}`" class="w-full h-32 object-cover rounded-lg" />
            </div>
          </div>
        </div>

        <!-- File Upload -->
        <UFormField name="files">
          <UFileUpload
            v-model="form.files"
            accept="image/*"
            multiple
            :label="isEditMode ? t('upload-new-images') : t('drop-your-images-here')"
            :description="isEditMode ? t('upload-to-replace-images') : t('description-upload-multiple-images')"
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
            <BaseSelectMenu
              v-model="provinceModel"
              :items="provinceOptions"
              label-key="label"
              value-key="value"
              :placeholder="t('select-province')"
              :disabled="loadingProvinces"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('ward')" name="commune">
            <BaseSelectMenu
              v-model="communeModel"
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
          :text="isEditMode ? t('update') : t('add')"
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
