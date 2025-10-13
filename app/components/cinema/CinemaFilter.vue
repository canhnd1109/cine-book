<script setup lang="ts">
import type { IFormState } from '~/types/cinema.type'

const { apply, filters } = useGenreData()

const emits = defineEmits<{
  search: []
  add: [value: boolean, form: IFormState]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between items-center">
    <BaseInput
      v-model="filters.search"
      :is-show-clear="true"
      @input="apply({ search: filters.search }, { debounce: true, resetPage: true })"
    />
    <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true, {} as IFormState)" />
  </div>
</template>

<style scoped></style>
