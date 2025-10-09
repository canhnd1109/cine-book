<script setup lang="ts">
const { t } = useI18n()

const { show = true, emptyText = 'no-data' } = defineProps<{
  show?: boolean
  emptyText?: string
}>()
</script>
<template>
  <div v-if="show" class="flex h-full flex-col items-center justify-center py-[22px]">
    <BaseIcon name="no-data" size="80" class="text-[#667085]" />

    <p class="mt-3 text-sm text-[#667085]">{{ t(`${emptyText}`) }}</p>
  </div>
</template>

<style scoped></style>
