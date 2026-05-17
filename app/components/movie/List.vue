<script setup lang="ts">
import { useMovieData } from '~/composables/useMovie'
import useFormatDate from '~/composables/useDateFormat'
import type { IActionCard } from '~/types/constant.type'
import type { IMovie } from '~/types/movie.type'

const { movies, filters, totalRecords } = useMovieData()

const { isFetching } = defineProps<{
  isFetching: boolean
}>()

const hoveredItem = ref<string | null>(null)

const emit = defineEmits<{
  'action-click': [action: IActionCard, item: IMovie]
}>()

const action = (action: IActionCard, item: IMovie) => {
  emit('action-click', action, item)
}
</script>

<template>
  <BaseSkeletonCard v-if="isFetching" />
  <BaseEmpty v-else-if="!movies.length" />
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <div v-for="item in movies" :key="item.id">
      <BaseCard :item="item" :index="0" class="w-full" @action-click="action">
        <template #image>
          <div class="flex items-center justify-center">
            <div class="relative flex items-center justify-center overflow-hidden rounded-lg w-full h-60">
              <div class="image-container" :class="{ 'slide-active': hoveredItem }">
                <img :src="item.posterUrl" class="absolute top-0 left-0 h-full w-full object-cover max-sm:object-center image" >
              </div>
            </div>
          </div>
        </template>

        <template #content>
          <p class="mt-2 truncate text-center font-medium" :title="item.name">
            {{ item.name }}
          </p>
          <!-- <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('director') }}: </span>
            <span>{{ item.director }}</span>
          </p>
          <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('performer') }}: </span>
            <span>{{ item.performer }}</span>
          </p> -->
          <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('releaseDate') }}: </span>
            <span>{{ useFormatDate(item.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</span>
          </p>
          <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('closeDate') }}: </span>
            <span>{{ useFormatDate(item.closeDate, 'DD/MM/YYYY hh:mm:ss') }}</span>
          </p>
          <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('nation') }}: </span>
            <span>{{ item.nation }}</span>
          </p>
          <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('duration') }}: </span>
            <span>{{ item.duration }} phút</span>
          </p>
          <!-- <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('note') }}: </span>
            <span>{{ item.note }}</span>
          </p> -->
          <p>
            <span class="text-[#90a1b9] text-sm">{{ $t('price-ticket') }}: </span>
            <span>{{ formatPrice(item.price) }}</span>
          </p>
          <p class="flex items-center gap-2">
            <span class="text-[#90a1b9] text-sm whitespace-nowrap">{{ $t('genres') }}:</span>
            <span class="truncate min-w-0 overflow-hidden" :title="item.genres.join(', ')">{{ item.genres.join(', ') }}</span>
          </p>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <!-- <p class="line-clamp-3" v-html="item.description" /> -->
        </template>
      </BaseCard>
    </div>
  </div>
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
