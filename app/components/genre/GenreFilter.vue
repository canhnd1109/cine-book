<script setup lang="ts">
import { useGenreData } from '~/pages/admin/movies/useGenre'

const { apply, filters } = useGenreData()

const emits = defineEmits<{
  search: []
  add: [value: boolean]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between items-center">
    <BaseInput v-model="filters.search" @input="apply({ search: filters.search }, { debounce: true, resetPage: true })" />
    <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true)" />
  </div>
</template>

<style scoped></style>
