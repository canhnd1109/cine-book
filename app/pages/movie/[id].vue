<script setup lang="ts">
import useFormatDate from '~/composables/useDateFormat'
import { apiPublic } from '~/services'
import type { TypeSeat, TypeSeatStatus } from '~/types/cinema.type'
import type { IShowtimeRoomResponse } from '~/types/show-time.type'

const route = useRoute()
const showTimeId = ref<string | null>(null)
const room = ref<IShowtimeRoomResponse>({} as IShowtimeRoomResponse)

// Fetch movie detail
const { data: movieDetail } = await useAsyncData(`movie-detail-${route.params.id}`, async () => {
  const res = await apiPublic.getMovieDetail(route.params.id as string)
  return res.value
})

// Fetch showtimes based on movie ID
const { data: showtimeData } = await useAsyncData(
  `showtimes-${route.params.id}`,
  async () => {
    if (!movieDetail.value?.id) return null
    const res = await apiPublic.fetchShowtimesByMovie(movieDetail.value.id as string)
    return res.value
  },
  {
    watch: [movieDetail]
  }
)

// Active cinema - auto select first cinema when data loads
const idCinemaActive = ref<string | null>(null)

// Auto-select first cinema when showtimeData changes
watch(
  showtimeData,
  newData => {
    if (newData && newData.length > 0 && !idCinemaActive.value) {
      idCinemaActive.value = newData[0]!.cinemaId
    }
  },
  { immediate: true }
)

// Computed showtime data based on selected cinema
const showTimeData = computed(() => {
  if (!showtimeData.value || !idCinemaActive.value) return []

  const selectedCinema = showtimeData.value.find(item => item.cinemaId === idCinemaActive.value)
  if (!selectedCinema?.showtimeDetails) return []

  const timelineItems = selectedCinema.showtimeDetails.map(item => ({
    id: item.id,
    timeline: item.timeline,
    date: item.date
  }))

  return processTimelineArray(timelineItems)
})

// Selected date index for horizontal date navigation
const selectedDateIndex = ref(0)

// Auto-reset selected date when showTimeData changes
watch(showTimeData, () => {
  selectedDateIndex.value = 0
})

// Get selected date data
const selectedDate = computed(() => {
  return showTimeData.value[selectedDateIndex.value] || null
})

const isValidTrailerUrl = computed(() => {
  const url = movieDetail.value?.trailerUrl
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false
  }
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
})

watch(showTimeId, newId => {
  const roomResponse = showtimeData.value
    ?.find(item => item.cinemaId === idCinemaActive.value)
    ?.showtimeDetails.find(room => room.id === newId)?.roomResponse

  if (roomResponse) {
    room.value = roomResponse
  }
})

// Seat types
interface Seat {
  row: number
  col: number
  type: TypeSeat
  price: number
  status?: TypeSeatStatus
  rowLabel?: string
  colLabel?: number
}

// Seat selection state
const selectedSeats = ref<Set<string>>(new Set())
const selectionMode = ref<'click' | 'drag'>('click')

// Convert room seats from array to Record format for BaseSeatGrid
const seatsRecord = computed(() => {
  if (!room.value.seats || room.value.seats.length === 0) return {}

  const record: Record<string, Seat> = {}
  room.value.seats.forEach(seat => {
    const rowIdx = seat.rowIdx - 1
    const colIdx = seat.colIdx - 1
    const key = `${rowIdx}-${colIdx}`
    record[key] = {
      row: seat.rowIdx, // Keep 1-indexed for display
      col: seat.colIdx,
      type: seat.seatName.toUpperCase() as TypeSeat,
      price: seat.price || 0,
      status: seat.booked ? 'BOOKED' : (seat.status as 'AVAILABLE' | 'BOOKED' | 'LOCKED') || 'AVAILABLE',
      rowLabel: String.fromCharCode(65 + rowIdx),
      colLabel: seat.colIdx
    }
  })
  return record
})

// Handle seat click
const restSeat = (data: { seatId: string; seat: Seat | undefined; selected: boolean }) => {
  console.log('Seat clicked:', data)
}

// Calculate selected seats info
const selectedSeatsInfo = computed(() => {
  const seats: Array<{ id: string; name: string; type: string; price: number }> = []
  let totalPrice = 0

  selectedSeats.value.forEach(seatId => {
    const seat = seatsRecord.value[seatId]
    if (seat) {
      const seatName = `${seat.rowLabel}-${seat.colLabel}`
      seats.push({
        id: seatId,
        name: seatName,
        type: seat.type,
        price: seat.price
      })
      totalPrice += seat.price
    }
  })

  return { seats, totalPrice, count: seats.length }
})

const embedUrl = computed(() => {
  const url = movieDetail.value?.trailerUrl
  if (!url || typeof url !== 'string') return ''

  try {
    const urlObj = new URL(url)

    // Check if it's a YouTube URL
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = ''

      // Handle different YouTube URL formats
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname.includes('/embed/')) {
          // Already in embed format
          return url
        } else if (urlObj.pathname.includes('/watch')) {
          // https://www.youtube.com/watch?v=VIDEO_ID
          videoId = urlObj.searchParams.get('v') || ''
        } else if (urlObj.pathname.includes('/shorts/')) {
          // https://www.youtube.com/shorts/VIDEO_ID
          videoId = urlObj.pathname.split('/shorts/')[1] || ''
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        // https://youtu.be/VIDEO_ID
        videoId = urlObj.pathname.slice(1)
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    return url
  } catch {
    return url
  }
})

const handleCinemaSelect = (cinemaId: string) => {
  idCinemaActive.value = cinemaId
  room.value = {} as IShowtimeRoomResponse
  showTimeId.value = null
}
</script>
<template>
  <div>
    <div v-if="movieDetail" class="max-w-4xl mx-auto flex justify-start gap-10">
      <img :src="movieDetail.posterUrl" alt="" class="h-[333px] w-[238px] rounded-lg" loading="lazy" />
      <div class="flex-1 space-y-1">
        <p class="text-2xl font-bold">{{ movieDetail.name }}</p>
        <p class="flex justify-between items-center">
          <span>{{ movieDetail.genres.join(',') }}</span>
          <span>{{ minutesToHours(movieDetail.duration) }}</span>
          <span>{{ movieDetail.nation }}</span>
        </p>
        <p>Đạo diễn: {{ movieDetail.director }}</p>
        <p>Diễn viên: {{ movieDetail.performer }}</p>
        <p>Thời gian khởi chiếu: {{ useFormatDate(movieDetail.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</p>
        <p>Thời gian kết thúc: {{ useFormatDate(movieDetail.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}</p>
        <p class="text-red-500">{{ movieDetail.note }}</p>
        <p class="mt-6">{{ movieDetail.description }}</p>
      </div>
    </div>

    <!-- Cinema Selection -->
    <div v-if="showtimeData && showtimeData.length > 0" class="max-w-4xl mx-auto my-6">
      <h3 class="text-xl font-semibold mb-4">Chọn rạp chiếu</h3>
      <div class="flex flex-wrap gap-3">
        <BaseButton
          v-for="item in showtimeData"
          :key="item.cinemaId"
          :text="`${item.cinemaName} (${item.province} - ${item.commune} - ${item.detailAddress})`"
          :variant="idCinemaActive === item.cinemaId ? 'solid' : 'outline'"
          @click="handleCinemaSelect(item.cinemaId)"
        />
      </div>
    </div>

    <!-- Showtimes Display -->
    <div v-if="showTimeData.length > 0" class="max-w-4xl mx-auto my-6">
      <h3 class="text-xl font-semibold mb-4">Lịch chiếu</h3>

      <!-- Horizontal Date Cards -->
      <div class="flex gap-3 mb-6 overflow-x-auto pb-2">
        <div
          v-for="(day, dayIndex) in showTimeData"
          :key="dayIndex"
          :class="[
            'flex flex-col items-center justify-center min-w-[100px] px-4 py-3 rounded-lg cursor-pointer transition-colors',
            selectedDateIndex === dayIndex
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="selectedDateIndex = dayIndex"
        >
          <span class="text-sm font-medium">Th. {{ day.fullDate.split(':')[1] }}</span>
          <span class="text-2xl font-bold my-1">{{ day.fullDate.split(':')[2] }}</span>
          <span class="text-sm">{{ day.weekday }}</span>
        </div>
      </div>
      <!-- Time Slots for Selected Date -->
      <div v-if="selectedDate" class="mt-6">
        <div class="flex flex-wrap gap-3">
          <BaseButton
            v-for="timeSlot in selectedDate.timeSlots"
            :key="timeSlot.id"
            :text="timeSlot.time"
            :variant="showTimeId === timeSlot.id ? 'solid' : 'outline'"
            class-name="min-w-[100px]"
            @click="showTimeId = timeSlot.id"
          />
        </div>
      </div>
    </div>

    <!-- Seat Selection -->
    <div v-if="showTimeId && room.roomId" class="max-w-6xl mx-auto my-6">
      <h3 class="text-xl font-semibold mb-4">Chọn ghế</h3>

      <div class="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
        <!-- Screen -->
        <div class="mb-8">
          <div class="w-full h-2 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-full mb-2" />
          <p class="text-center text-sm text-gray-500">Màn hình</p>
        </div>

        <!-- Seat Grid -->
        <BaseSeatGrid
          :rows="room.totalRow"
          :cols="room.totalCol"
          :seats="seatsRecord"
          :selected-seats="selectedSeats"
          :selection-mode="selectionMode"
          mode="booking"
          @update:selected-seats="selectedSeats = $event"
          @seat-click="restSeat"
        />

        <!-- Selected Info Summary -->
        <div v-if="selectedSeatsInfo.count > 0" class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <div class="space-y-4">
            <!-- Selected Seats -->
            <div>
              <p class="text-sm font-medium mb-2">Ghế đã chọn:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="seat in selectedSeatsInfo.seats"
                  :key="seat.id"
                  class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium"
                >
                  {{ seat.name }}
                </span>
              </div>
            </div>

            <!-- Total and Payment -->
            <div class="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span class="text-lg font-semibold">Tổng tiền:</span>
                <span class="text-2xl font-bold text-red-500">{{ formatPrice(selectedSeatsInfo.totalPrice) }}</span>
              </div>
              <BaseButton text="Thanh toán" variant="solid" class-name="px-8" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isValidTrailerUrl"
      class="w-full max-w-4xl mx-auto my-6 overflow-hidden rounded-2xl shadow-lg"
      style="aspect-ratio: 16/9"
    >
      <iframe
        :src="embedUrl"
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
  </div>
</template>

<style scoped></style>
