<script setup lang="ts">
// import { debounce } from 'lodash-es'

const props = defineProps<{ modelValue: string }>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input'): void
}>()

const { t } = useI18n()
const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    inputValue.value = val
  }
)

// const handleSearch = debounce(() => {
//   emits('search')
// }, 400)

const onInput = (val: string) => {
  inputValue.value = val
  emits('update:modelValue', val)
  emits('input')
  // handleSearch()
}
</script>

<template>
  <UInput
    :model-value="inputValue"
    icon="i-lucide-search"
    size="lg"
    variant="outline"
    loading-icon="i-lucide-loader"
    :placeholder="t('search')"
    @update:model-value="onInput"
  />
</template>
