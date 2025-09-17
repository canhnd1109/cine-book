<template>
  <UButton
    :loading="isLoading"
    :loading-icon="loadingIcon"
    :class="`cursor-pointer rounded-full py-[10px] px-4 ${className}`"
    :variant
    :color
    :trailing-icon="trailingIcon"
    :to
    :type
    :disabled="isDisable"
    :target
    :ui
  >
    {{ text }}
  </UButton>
</template>

<script setup lang="ts">
import type {
  RouteLocationAsRelativeGeneric,
  RouteLocationAsPathGeneric
} from 'vue-router'
import type { ClassNameValue } from 'tailwind-merge'

const {
  isLoading = false,
  loadingIcon = 'i-lucide-loader',
  className = '', variant = 'outline',
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
  target?: null | '_blank' | '_parent' | '_self' | '_top' | string & {}
  ui?: { base?: ClassNameValue, label?: ClassNameValue, leadingIcon?: ClassNameValue, leadingAvatar?: ClassNameValue, leadingAvatarSize?: ClassNameValue, trailingIcon?: ClassNameValue }
}>()
</script>

<style scoped>

</style>
