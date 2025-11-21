<script setup lang="ts">
import { useMovieData } from '~/composables/useMovie'
import type { ICreateMovie } from '~/schemas/movie.chema'
import { ORDER_BY_MOVIE, LIST_PRICE_MOVIE, DEFAULT_QUERY_PAGINATION } from '~/constants'

const { genres } = storeToRefs(useBaseStore())

const emits = defineEmits<{
  search: []
  add: [value: boolean, form: ICreateMovie]
}>()

const { t } = useI18n()

const { apply, filters } = useMovieData()

const handleSelectedPrice = (value: string) => {
  filters.value.rangePrice = value
  if (value) {
    const [min, max] = value.includes('-')
      ? value.split('-').map(Number)
      : [value === '100000' ? null : 500000, value === '100000' ? 100000 : null]

    filters.value.minPrice = min || 0
    filters.value.maxPrice = max || 0
  } else {
    filters.value.minPrice = ''
    filters.value.maxPrice = ''
  }
  apply(
    { minPrice: filters.value.minPrice, maxPrice: filters.value.maxPrice, rangePrice: filters.value.rangePrice },
    { resetPage: true }
  )
}

const resetFilter = () => {
  apply(
    {
      ...DEFAULT_QUERY_PAGINATION,
      searchName: '',
      genre: '',
      rangePrice: '',
      maxPrice: '',
      minPrice: '',
      orderBy: '',
      orderType: ''
    },
    { resetPage: true }
  )
}
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
        :items="ORDER_BY_MOVIE"
        :placeholder="t('order-by')"
        @change="apply({ orderBy: $event as typeof filters.orderBy }, { resetPage: true })"
      />
      <BaseSelect
        v-model="filters.genre"
        :items="genres"
        label-key="name"
        value-key="id"
        :placeholder="t('genre')"
        @change="apply({ genre: $event as string }, { resetPage: true })"
      />
      <BaseSelect
        v-model="filters.rangePrice"
        :items="LIST_PRICE_MOVIE"
        :placeholder="t('price-ticket')"
        @change="handleSelectedPrice($event as string)"
      />
      <UTooltip :text="t('reset-filter')" :delay-duration="0">
        <UIcon name="i-lucide-rotate-ccw" class="size-5 hover:cursor-pointer" @click="resetFilter" />
      </UTooltip>
    </div>
    <div>
      <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="emits('add', true, {} as ICreateMovie)" />
    </div>
  </div>
</template>

<style scoped></style>
