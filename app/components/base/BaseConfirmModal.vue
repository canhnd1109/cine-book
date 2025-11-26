<script setup lang="ts">
interface Props {
  open?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: '',
  description: '',
  confirmText: '',
  cancelText: '',
  isLoading: false,
  variant: 'danger'
})

const { t } = useI18n()

// Computed cho text với fallback i18n
const modalTitle = computed(() => props.title || t('confirm-title'))
const modalDescription = computed(() => props.description || t('confirm-description'))
const modalConfirmText = computed(() => props.confirmText || t('confirm-button'))
const modalCancelText = computed(() => props.cancelText || t('cancel-button'))

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'confirm' | 'cancel'): void
}

const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}

const iconConfig = computed(() => {
  switch (props.variant) {
    case 'danger':
      return {
        icon: 'i-lucide-trash-2',
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      }
    case 'warning':
      return {
        icon: 'i-lucide-alert-triangle',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
      }
    case 'info':
      return {
        icon: 'i-lucide-info',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      }
    default:
      return {
        icon: 'i-lucide-trash-2',
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      }
  }
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="title" class="w-1/3">
    <template #body>
      <div class="flex items-center gap-4">
        <!-- Icon -->
        <div :class="[iconConfig.bgColor, 'shrink-0 flex items-center justify-center w-12 h-12 rounded-full']">
          <UIcon :name="iconConfig.icon" :class="[iconConfig.color, 'w-6 h-6']" />
        </div>

        <!-- Content -->
        <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ modalDescription }}
        </p> -->
        <!--  eslint-disable-next-line vue/no-v-html -->
        <p class="text-sm text-gray-500 dark:text-gray-400" v-html="modalDescription" />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <BaseButton :text="modalCancelText" :variant="'outline'" :is-disable="isLoading" @click="handleCancel" />
        <BaseButton
          :text="modalConfirmText"
          :color="variant === 'danger' ? 'error' : variant === 'warning' ? 'warning' : 'primary'"
          variant="solid"
          :is-loading="isLoading"
          :is-disable="isLoading"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
