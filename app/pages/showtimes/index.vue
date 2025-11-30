<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const dateRange = generateDateRange()

const getInitialDate = () => {
  const dateParam = route.query.date as string
  return dateParam ? (dateRange.find(d => d.apiFormat === dateParam) ?? dateRange[0]!) : dateRange[0]!
}

const activeDate = ref<DateItem>(getInitialDate())
const selectedDateApi = computed(() => activeDate.value.apiFormat)

const { data: movies, pending, refresh } = useFetchMoviesByDay(selectedDateApi)

watch(selectedDateApi, () => refresh(), { immediate: true })

const changeDate = (item: DateItem) => {
  activeDate.value = item
  router.push({ query: { date: item.apiFormat } })
}
const handleMovieClick = (movieId: string) => {
  router.push({ name: 'movie-id', params: { id: movieId } })
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

    <div v-if="pending" class="mx-auto grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] mb-10">
      <div
        v-for="(_item, index) in 2"
        :key="index"
        class="border flex justify-center border-solid gap-6 border-border-light dark:border-border-dark p-4 rounded-lg"
      >
        <USkeleton class="w-1/2 h-60" />
        <div class="flex flex-col space-y-4 w-1/2">
          <USkeleton class="w-full h-10" />
          <USkeleton class="w-full h-10" />
          <USkeleton class="w-full h-10" />
          <USkeleton class="w-full h-10" />
        </div>
      </div>
    </div>

    <!-- Movies list -->
    <div v-else-if="movies && movies.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="border border-solid border-border-light dark:border-border-dark hover:cursor-pointer hover:border-primary rounded-lg overflow-hidden flex gap-4 p-4"
      >
        <!-- Movie Poster -->
        <div class="shrink-0">
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
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p v-if="movie.note" class="text-red-500 text-xs mt-2" v-html="movie.note" />
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
                @click="handleMovieClick(movie.id)"
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
