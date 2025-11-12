<script setup lang="ts">
import { apiPublic } from '~/services'
import { ORDER_BY_MOVIE, LIST_PRICE_MOVIE, DEFAULT_QUERY_PAGINATION } from '~/constants'

const { genres } = storeToRefs(useBaseStore())
const { t } = useI18n()
const { filters, movies, totalRecords, apply, setRefreshCallback } = useMovieData()
const router = useRouter()
const {
  data,
  pending: isFetching,
  refresh
} = await useAsyncData('movies-list', async () => {
  const res = await apiPublic.fetchMovies(filters.value)
  return res.value
})

watchEffect(() => {
  movies.value = data.value?.content || []
  totalRecords.value = data.value?.totalElements || 0
})

setRefreshCallback(refresh)

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

const handleMovieClick = (movieId: string) => {
  router.push({ name: 'movie-id', params: { id: movieId } })
}
</script>
<template>
  <div class="container mx-auto my-10 space-y-6">
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
        @change="apply({ orderBy: $event }, { resetPage: true })"
      />
      <BaseSelect
        v-model="filters.genre"
        :items="genres"
        label-key="name"
        value-key="id"
        :placeholder="t('genre')"
        @change="apply({ genre: $event }, { resetPage: true })"
      />
      <BaseSelect
        v-model="filters.rangePrice"
        :items="LIST_PRICE_MOVIE"
        :placeholder="t('price-ticket')"
        @change="handleSelectedPrice($event)"
      />
      <UTooltip :text="t('reset-filter')" :delay-duration="0">
        <UIcon name="i-lucide-rotate-ccw" class="size-5 hover:cursor-pointer" @click="resetFilter" />
      </UTooltip>
    </div>
    <BaseSkeletonCard v-if="isFetching" />
    <BaseEmpty v-else-if="!movies.length" />
    <UCarousel v-else v-slot="{ item, index }" :items="movies" :ui="{ item: 'basis-1/6 ps-8' }" class="mt-6">
      <div class="cursor-pointer group" @click="handleMovieClick(item.id)">
        <div class="relative overflow-hidden">
          <img
            :src="item.posterUrl"
            :alt="item.name"
            class="object-cover image max-sm:object-center h-[445px] hover:scale-105 transition duration-500"
            :class="index % 2 === 0 ? 'clip-shape-right' : 'clip-shape-left'"
            loading="lazy"
          />

          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
        </div>

        <p class="flex justify-between items-center text-[#999] mt-2 text-sm">
          <span class="truncate">{{ item.genres.join(', ') }}</span>
          <span class="flex-shrink-0 ml-2">{{ useDateFormat(item.releaseDate, 'DD/MM/YYYY') }}</span>
        </p>

        <p class="flex justify-between items-center mt-1">
          <span class="text-xl font-bold truncate">{{ item.name }}</span>
          <span class="flex-shrink-0 ml-2 text-sm">{{ minutesToHours(item.duration) }}</span>
        </p>
      </div>
    </UCarousel>

    <BasePagination
      :current-page="filters.pageIndex"
      :items-per-page="filters.pageSize"
      :total="totalRecords"
      @update:page="
        page => {
          filters.pageIndex = page
        }
      "
    />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  position: relative;
  overflow: hidden;
}

.action-buttons-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.card:hover .action-buttons-wrapper {
  transform: translateY(0);
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
