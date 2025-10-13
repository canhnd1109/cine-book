<script setup lang="ts" generic="T extends SelectItem">
import type { SelectItem } from '@nuxt/ui'

const {
  items,
  labelKey = 'label',
  valueKey = 'value',
  baseStyle = '',
  valueStyle = '',
  contentStyle = '',
  placeholder = '',
  multiple = false,
  required = false
} = defineProps<{
  items: T
  labelKey?: string
  valueKey?: string
  baseStyle?: string
  valueStyle?: string
  contentStyle?: string
  placeholder?: string
  multiple?: boolean
  required?: boolean
}>()

const model = defineModel<any>({
  required: false,
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
  <USelect
    v-model="model"
    :items="[items]"
    :value-key="valueKey as string"
    :label-key="labelKey as string"
    class="w-40"
    :placeholder
    :multiple
    :required
    :ui="{
      base: `h-10 hover:cursor-pointer ${baseStyle}`,
      value: `ml-2 hover:cursor-pointer ${valueStyle}`,
      content: `hover:cursor-pointer ${contentStyle}`,
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
    @update:model-value="handleChange"
    @blur="emit('blur', $event)"
    @focus="emit('focus')"
  />
</template>
