<script setup lang="ts">
const { t } = useI18n()

interface Props {
  currentPage?: number
  itemsPerPage?: number
  total?: number
  showFirstLast?: boolean
  showEdges?: boolean
  maxButtons?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link'
  color?: string
  disabled?: boolean
  showInfo?: boolean
  infoPosition?: 'left' | 'right' | 'top' | 'bottom'
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  itemsPerPage: 10,
  total: 0,
  showFirstLast: false,
  showEdges: true,
  maxButtons: 5,
  size: 'md',
  color: '',
  variant: 'solid',
  disabled: false,
  showInfo: true,
  infoPosition: 'left',
  label: ''
})

const emit = defineEmits<{
  'update:page': [page: number]
  change: [page: number]
}>()

const handlePageChange = (page: number) => {
  if (props.disabled) return
  emit('update:page', page)
  emit('change', page)
}

const startItem = computed(() => {
  return props.total === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.total)
})

const isHorizontal = computed(() => ['left', 'right'].includes(props.infoPosition))
</script>

<template>
  <div
    :class="[
      'flex gap-4',
      isHorizontal ? 'items-center' : 'flex-col',
      infoPosition === 'right' || infoPosition === 'bottom' ? 'flex-row-reverse' : '',
      isHorizontal ? 'justify-between' : 'items-center'
    ]"
  >
    <!-- Info text -->
    <div v-if="showInfo" class="text-sm text-gray-500 dark:text-gray-400">
      {{ t('showing') }} <span class="font-medium">{{ startItem }}</span> - <span class="font-medium">{{ endItem }}</span> /
      <span class="font-medium">{{ total }}</span> {{ props.label }}
    </div>

    <!-- UPagination -->
    <UPagination
      :model-value="currentPage"
      :page-count="itemsPerPage"
      :total="total"
      :max="maxButtons"
      :size="size"
      :active-button="{ variant: 'solid', color: color }"
      :inactive-button="{ variant: variant, color: color }"
      :prev-button="{
        icon: 'i-heroicons-chevron-left',
        variant: variant,
        color: color
      }"
      :next-button="{
        icon: 'i-heroicons-chevron-right',
        variant: variant,
        color: color
      }"
      :first-button="
        showFirstLast
          ? {
              icon: 'i-heroicons-chevron-double-left',
              variant: variant,
              color: color
            }
          : undefined
      "
      :last-button="
        showFirstLast
          ? {
              icon: 'i-heroicons-chevron-double-right',
              variant: variant,
              color: color
            }
          : undefined
      "
      :disabled="disabled"
      :show-edges="showEdges"
      @update:model-value="handlePageChange"
    />
  </div>
</template>
