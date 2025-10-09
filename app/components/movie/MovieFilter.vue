<script setup lang="ts">
import { useMovieData } from '~/pages/admin/movies/useMovie'
import type { ICreateMovie } from '~/schemas/movie.chema'
import { ORDER_BY_MOVIE } from '~/constants'

const emits = defineEmits<{
  search: []
  add: [value: boolean, form: ICreateMovie]
}>()

const { t } = useI18n()

const { apply, filters } = useMovieData()
</script>

<template>
  <div class="flex justify-between items-center">
    <div class="flex justify-start items-center gap-3">
      <BaseInput
        v-model="filters.searchName"
        :is-show-clear="true"
        @input="apply({ searchName: filters.searchName }, { debounce: true, resetPage: true })"
      />
      <BaseSelect
        :model-value="filters.orderBy"
        :item="ORDER_BY_MOVIE"
        :placeholder="t('order-by')"
        class="w-40"
        @change="apply({ orderBy: $event }, { resetPage: true })"
      />
    </div>
    <div>
      <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true, {} as ICreateMovie)" />
    </div>
  </div>
</template>

<style scoped></style>
