<script setup lang="ts" generic="T extends SelectItem">
import type { SelectItem } from '@nuxt/ui'

const model = defineModel<any>({
  required: false,
  default: ''
})

const {
  item,
  labelKey = 'label',
  valueKey = 'value',
  baseStyle = '',
  valueStyle = '',
  contentStyle = '',
  placeholder = '',
  multiple = false,
  required = false
} = defineProps<{
  item: T
  labelKey?: string
  valueKey?: string
  baseStyle?: string
  valueStyle?: string
  contentStyle?: string
  placeholder?: string
  multiple?: boolean
  required?: boolean
}>()
</script>

<template>
  <USelect
    v-model="model"
    :items="[item]"
    :value-key="valueKey as string"
    :label-key="labelKey as string"
    class="w-48"
    :placeholder
    :multiple
    :required
    :ui="{
      base: `h-10 hover:cursor-pointer ${baseStyle}`,
      value: `ml-2 hover:cursor-pointer ${valueStyle}`,
      content: `hover:cursor-pointer ${contentStyle}`,
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
  />
</template>
