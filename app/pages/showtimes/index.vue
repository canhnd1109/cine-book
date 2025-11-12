<script setup lang="ts">
import type { IMovieByDay } from '~/types/movie.type'

interface DateItem {
  date: Date
  formatted: string
  apiFormat: string
  isToday: boolean
}

const generateDateRange = (daysCount: number = 9) => {
  const dates: DateItem[] = []
  const today = new Date()

  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const year = currentDate.getFullYear()

    dates.push({
      date: currentDate,
      formatted: `${day}-${month}-${year}`,
      apiFormat: `${year}-${month}-${day}`,
      isToday: i === 0
    })
  }

  return dates
}

const dateRange = generateDateRange()
const activeDate = ref<DateItem>(dateRange[0]!)
const movies = ref<IMovieByDay[]>([])
const selectedDateApi = computed(() => activeDate.value.apiFormat)

const { data: moviesData, pending } = useFetchMoviesByDay(selectedDateApi)

watchEffect(() => {
  movies.value = moviesData.value || []
})
const changeDate = (item: DateItem) => {
  activeDate.value = item
}
</script>

<template>
  <div class="container mx-auto space-y-6">
    <div class="flex justify-center">
      <p class="flex justify-start items-center gap-2 mx-auto">
        <span class="rounded-full bg-red-500 w-4 h-4" />
        <span class="text-3xl font-bold">Danh sách phim chiếu theo ngày</span>
      </p>
    </div>

    <div class="flex justify-center flex-wrap gap-4">
      <BaseButton
        v-for="(item, index) in dateRange"
        :key="index"
        :text="item.isToday ? 'Hôm nay' : item.formatted"
        :variant="item.formatted === activeDate.formatted ? 'solid' : 'outline'"
        class-name="rounded-lg"
        @click="changeDate(item)"
      />
    </div>

    <BaseSkeletonCard v-if="pending" />

    <!-- Movies list -->
    <div v-else-if="movies && movies.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="border border-solid border-border-light dark:border-border-dark hover:cursor-pointer hover:border-primary rounded-lg overflow-hidden flex gap-4 p-4"
      >
        <!-- Movie Poster -->
        <div class="flex-shrink-0">
          <img
            :src="movie.posterUrl"
            :alt="movie.name"
            class="w-64 h-80 object-cover rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        </div>

        <!-- Movie Info -->
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <!-- Movie Title & Duration -->
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="text-xl font-bold text-white mb-1">{{ movie.name }}</h3>
                <p class="text-gray-400 text-sm">{{ movie.duration }} phút</p>
              </div>
              <span class="bg-gray-800 text-white px-3 py-1 rounded text-sm font-semibold">2D</span>
            </div>

            <!-- Movie Details -->
            <div class="space-y-1 text-sm mb-4">
              <p class="text-gray-400">
                <span class="text-white font-semibold">Thể loại:</span>
                {{ movie.genres.join(', ') }}
              </p>
              <p class="text-gray-400">
                <span class="text-white font-semibold">Xuất xứ:</span>
                {{ movie.nation }}
              </p>
              <p class="text-gray-400">
                <span class="text-white font-semibold">Khởi chiếu:</span>
                {{ useDateFormat(movie.releaseDate, 'DD/MM/YYYY') }}
              </p>
              <p v-if="movie.note" class="text-red-500 text-xs mt-2">
                {{ movie.note }}
              </p>
            </div>
          </div>

          <!-- Showtimes -->
          <div>
            <h4 class="text-white font-semibold mb-3">Lịch chiếu</h4>
            <div class="flex flex-wrap gap-2">
              <BaseButton
                v-for="showtime in movie.showtimeDetailResponses"
                :key="showtime.id"
                :text="showtime.startTime"
                class-name="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseEmpty v-else />
  </div>
</template>

<style scoped></style>
