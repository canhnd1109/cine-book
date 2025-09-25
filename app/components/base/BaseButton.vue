<script setup lang="ts">
import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router'
import type { ClassNameValue } from 'tailwind-merge'
import { debounce } from 'lodash-es'

const {
  isLoading = false,
  loadingIcon = 'i-lucide-loader',
  className = '',
  variant = 'outline',
  color = 'success',
  trailingIcon = '',
  to = '',
  type = 'button',
  isDisable = false,
  target = null,
  ui = {}
} = defineProps<{
  text?: string
  isLoading?: boolean
  loadingIcon?: string
  className?: string
  variant?: 'link' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost'
  size?: 'md' | 'xs' | 'sm' | 'lg' | 'xl'
  color?: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
  trailingIcon?: string
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
  type?: 'reset' | 'submit' | 'button'
  isDisable?: boolean
  target?: null | '_blank' | '_parent' | '_self' | '_top' | (string & {})
  ui?: {
    base?: ClassNameValue
    label?: ClassNameValue
    leadingIcon?: ClassNameValue
    leadingAvatar?: ClassNameValue
    leadingAvatarSize?: ClassNameValue
    trailingIcon?: ClassNameValue
  }
}>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = debounce(() => {
  if (isLoading) {
    return
  }
  emit('click')
}, 300)
</script>

<template>
  <UButton
    :loading="isLoading"
    :loading-icon="loadingIcon"
    :class="`cursor-pointer flex justify-center items-center rounded-full py-[10px] px-4 ${className}`"
    :variant
    :color
    :trailing-icon="trailingIcon"
    :to
    :type
    :disabled="isDisable"
    :target
    :ui
    @click="handleClick"
  >
    {{ text }}
  </UButton>
</template>

<style scoped></style>
