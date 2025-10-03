<script setup lang="ts">
import { debounce } from 'lodash-es'
const emits = defineEmits<{
  search: []
  add: [value: boolean]
}>()
const search = defineModel<string>('search', { default: '' })

const handleSearch = debounce(() => {
  emits('search')
}, 400)
</script>

<template>
  <div class="flex justify-between items-center">
    <UInput
      v-model="search"
      icon="i-lucide-search"
      size="lg"
      variant="outline"
      loading-icon="i-lucide-loader"
      placeholder="Search..."
      @update:model-value="handleSearch"
    />
    <BaseButton text="Thêm mới" variant="solid" class-name="rounded" @click="emits('add', true)" />
  </div>
</template>

<style scoped></style>
