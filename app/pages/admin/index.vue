<script setup lang="ts">
import { DEFAULT_QUERY_PAGINATION } from '~/constants'

definePageMeta({ layout: 'admin', middleware: ['admin'] })
const { apply } = useMovieData()

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
resetFilter()
</script>

<template>
  <div class="bg-bg-light dark:bg-bg-primary-dark flex-1 rounded-lg mr-6">Admin Dashboard</div>
</template>

<style scoped></style>
