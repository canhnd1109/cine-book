<script setup lang="ts">
const {
  modelValue = '',
  isShowClear = false,
  baseStyle = ''
} = defineProps<{
  modelValue?: string
  isShowClear?: boolean
  baseStyle?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input'): void
}>()

const { t } = useI18n()
const inputValue = ref(modelValue)

watch(
  () => modelValue,
  val => {
    inputValue.value = val
  }
)

const onInput = (val: string) => {
  inputValue.value = val
  emits('update:modelValue', val)
  emits('input')
}

const clearInput = () => {
  onInput('')
}
</script>

<template>
  <UInput
    :model-value="inputValue"
    icon="i-lucide-search"
    size="xl"
    variant="outline"
    loading-icon="i-lucide-loader"
    :placeholder="t('search')"
    :ui="{ base: `w-68 ${baseStyle}` }"
    @update:model-value="onInput"
  >
    <template v-if="isShowClear && inputValue?.length" #trailing>
      <UButton color="neutral" variant="link" size="sm" icon="i-lucide-circle-x" aria-label="Clear input" @click="clearInput" />
    </template>
  </UInput>
</template>
