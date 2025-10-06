<script setup lang="ts">
import { useGenreFilterSync } from '~/pages/admin/movies/useGenre'

const { apply } = useGenreFilterSync()
const emits = defineEmits<{
  search: []
  add: [value: boolean]
}>()
const search = defineModel<string>('search', { default: '' })
const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between items-center">
    <BaseInput v-model="search" @input="apply({ search }, { debounce: true, resetPage: true })" />
    <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true)" />
  </div>
</template>

<style scoped></style>
