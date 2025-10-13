<script setup lang="ts">
const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const { t } = useI18n()
</script>
<template>
  <UModal v-model:open="isOpen" :title="t('add-cinema')" class="!w-[1000px]">
    <template #body />
  </UModal>
</template>

<style scoped></style>
