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

    <!-- Loading skeleton -->
    <div v-if="loading" class="mt-6 flex gap-8 overflow-hidden">
      <BaseSkeletonCard v-for="n in 6" :key="n" />
    </div>

    <!-- Movie carousel -->
    <UCarousel v-else-if="movies.length" v-slot="{ item, index }" :items="movies" :ui="{ item: 'basis-1/6' }" class="mt-6">
      <div class="cursor-pointer group" :class="index !== 0 ? 'ps-8' : ''" @click="handleMovieClick(item.id)">
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

    <!-- Empty state -->
    <BaseEmpty v-else />
  </div>
</template>
