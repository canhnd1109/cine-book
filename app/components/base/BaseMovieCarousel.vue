<script setup lang="ts">
import type { IMovie } from '~/types/movie.type'

interface Props {
  title: string
  movies: IMovie[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const router = useRouter()

const handleMovieClick = (movieId: string) => {
  router.push({ name: 'movie-id', params: { id: movieId } })
}
</script>

<template>
  <div class="mx-12 mt-6">
    <div class="flex justify-start items-center gap-2">
      <p class="rounded-full bg-red-500 w-4 h-4" />
      <p class="text-3xl font-bold">{{ title }}</p>
    </div>

    <BaseSkeletonCard v-if="loading" :skeleton-cards="6" class="mt-10" />

    <!-- Movie carousel -->
    <UCarousel v-else-if="movies.length" v-slot="{ item, index }" :items="movies" :ui="{ item: 'basis-1/5 ps-8' }" class="mt-6">
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
        <div class="space-y-1">
          <p class="text-xl font-bold truncate mt-2">{{ item.name }}</p>
          <div class="flex justify-between items-center">
            <p class="flex gap-1 items-center text-[#999]">
              <UIcon name="i-lucide-message-circle-more" class="size-4" />
              <span>{{ formatNumber(item.totalComment) }}</span>
            </p>
            <p class="text-sm text-[#999]">{{ minutesToHours(item.duration) }}</p>
            <p class="text-sm text-[#999]">{{ useDateFormat(item.releaseDate, 'DD/MM/YYYY') }}</p>
          </div>
          <p class="truncate text-sm text-[#999]">{{ item.genres.join(', ') }}</p>
        </div>
      </div>
    </UCarousel>

    <!-- Empty state -->
    <BaseEmpty v-else />
  </div>
</template>
