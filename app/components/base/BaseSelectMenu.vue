<script setup lang="ts" generic="T extends SelectItem">
import type { SelectItem } from '@nuxt/ui'

const {
  items,
  labelKey = 'label',
  valueKey = 'value',
  baseStyle = '',
  valueStyle = '',
  contentStyle = '',
  placeholder = 'Chọn...',
  multiple = false,
  searchable = false,
  searchablePlaceholder = 'Tìm kiếm...',
  required = false,
  disabled = false
} = defineProps<{
  items: T[]
  labelKey?: string
  valueKey?: string
  baseStyle?: string
  valueStyle?: string
  contentStyle?: string
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  searchablePlaceholder?: string
  required?: boolean
  disabled?: boolean
}>()

const model = defineModel<any>({
  required: true,
  default: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  blur: [e: FocusEvent]
  focus: []
  change: [value: any]
}>()

function handleChange(value: any) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="[items]"
    :value-key="valueKey as string"
    :label-key="labelKey as string"
    :placeholder="placeholder"
    :multiple
    :searchable
    :searchable-placeholder="searchablePlaceholder"
    :required
    :disabled
    :ui="{
      base: `hover:cursor-pointer ${baseStyle}`,
      value: `hover:cursor-pointer ${valueStyle}`,
      content: `hover:cursor-pointer ${contentStyle}`,
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
    @update:model-value="handleChange"
    @blur="emit('blur', $event)"
    @focus="emit('focus')"
  />
</template>
