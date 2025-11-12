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

const { data, pending } = useFetchMoviesByDay(selectedDateApi)

watch(
  data,
  newData => {
    console.log('🚀 ~ newData:', newData)
    if (newData) {
      movies.value = newData
      console.log('🚀 ~ movies.value:', movies.value)
    }
  },
  { immediate: true }
)

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
    <div v-else-if="movies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {{ movies }}
    </div>

    <BaseEmpty v-else />
  </div>
</template>

<style scoped></style>
