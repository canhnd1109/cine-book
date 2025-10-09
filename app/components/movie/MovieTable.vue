<script setup lang="ts">
import { useMovieData } from '~/pages/admin/movies/useMovie'
import useFormatDate from '~/composables/useDateFormat'

const { movies } = useMovieData()

const { isFetching } = defineProps<{
  isFetching: boolean
}>()

const hoveredItem = ref<string | null>(null)
</script>

<template>
  <div v-for="item in movies" :key="item.id" class="grid-cols-5 gap-6 grid">
    <BaseCard :item="item" :index="0" class="w-full">
      <template #image>
        <div class="flex items-center justify-center">
          <div class="relative flex items-center justify-center overflow-hidden rounded-lg w-full h-60">
            <div class="image-container" :class="{ 'slide-active': hoveredItem }">
              <img :src="item.posterUrl" class="absolute top-0 left-0 h-full w-full object-cover max-sm:object-center" />
            </div>
          </div>
        </div>
      </template>

      <template #content>
        <p class="mt-2 line-clamp-2 text-center font-medium">
          {{ item.name }}
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Director: </span>
          <span>{{ item.director }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Performer: </span>
          <span>{{ item.performer }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Release date: </span>
          <span>{{ useFormatDate(item.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Close date: </span>
          <span>{{ useFormatDate(item.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Nation: </span>
          <span>{{ item.nation }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Duration: </span>
          <span>{{ item.duration }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Note: </span>
          <span>{{ item.note }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Price: </span>
          <span>{{ item.price }}</span>
        </p>
        <p>
          <span class="text-[#90a1b9] text-sm">Genres: </span>
          <span>{{ item.genres.join(', ') }}</span>
        </p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="line-clamp-3" v-html="item.description" />
      </template>
    </BaseCard>
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
