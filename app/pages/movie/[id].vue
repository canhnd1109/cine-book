<script setup lang="ts">
import useFormatDate from '~/composables/useDateFormat'
import { apiBooking, apiComment, apiPublic } from '~/services'
import type { TypeSeat, TypeSeatStatus } from '~/types/cinema.type'
import type { IShowtimeRoomResponse } from '~/types/show-time.type'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const { isAuthenticated, isOpenModalSignIn } = storeToRefs(useAuthStore())
const movieId = computed(() => route.params.id as string)

// Socket setup
const {
  joinShowtimeRoom,
  leaveShowtimeRoom,
  selectSeat,
  onSeatSelected,
  offSeatSelected,
  onBulkSeatsUpdate,
  offBulkSeatsUpdate
} = useSocket()

// State
const showTime = ref<TimeSlot | null>(null)
const room = ref<IShowtimeRoomResponse | null>(null)
const isBooking = ref(false)
const isLoadingRoom = ref(false)
const selectedSeats = ref<Set<string>>(new Set())
const selectedDateIndex = ref(0)
const idCinemaActive = ref<string | null>(null)
const lockedSeats = ref<Set<string>>(new Set()) // Ghế đang được người khác chọn

// Fetch movie detail
const { data: movieDetail } = await useAsyncData(`movie-detail-${movieId.value}`, () =>
  apiPublic.getMovieDetail(movieId.value).then(res => res.value)
)

const { data: comments, refresh: refreshComments } = await useAsyncData(`comments-${movieId.value}`, () =>
  apiPublic.fetchComments(movieId.value).then(res => res.value)
)

const handleRefreshComments = async () => {
  await refreshComments()
}

// Fetch showtimes
const { data: showtimeData } = await useAsyncData(
  `showtimes-${movieId.value}`,
  async () => {
    if (!movieDetail.value?.id) return null
    return apiPublic.fetchShowtimesByMovie(movieDetail.value.id).then(res => res.value)
  },
  { watch: [movieDetail] }
)

// Auto-select first cinema
watch(
  showtimeData,
  newData => {
    if (newData && newData.length > 0 && !idCinemaActive.value) {
      idCinemaActive.value = newData[0]!.cinemaId
    }
  },
  { immediate: true }
)

const showTimeData = computed(() => {
  if (!showtimeData.value || !idCinemaActive.value) return []

  const selectedCinema = showtimeData.value.find(item => item.cinemaId === idCinemaActive.value)
  if (!selectedCinema?.showtimeDetails) return []

  const timelineItems = selectedCinema.showtimeDetails.map(item => ({
    id: item.id,
    timeline: item.startTime,
    date: item.date,
    roomName: item.roomResponse.name
  }))

  return processTimelineArray(timelineItems)
})

// Reset selected date when showtime data changes
watch(showTimeData, () => {
  selectedDateIndex.value = 0
})

// Get selected date
const selectedDate = computed(() => showTimeData.value[selectedDateIndex.value] || null)

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

const countdownSeconds = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

const formattedCountdown = computed(() => {
  const minutes = Math.floor(countdownSeconds.value / 60)
  const seconds = countdownSeconds.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  countdownSeconds.value = 300

  countdownInterval.value = setInterval(() => {
    countdownSeconds.value--

    if (countdownSeconds.value <= 0) {
      clearInterval(countdownInterval.value!)
      navigateTo('/')
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  countdownSeconds.value = 0
}

onMounted(() => {
  // Handle single seat selection (real-time updates)
  onSeatSelected(data => {
    if (data.selected) {
      lockedSeats.value.add(data.seatId)
    } else {
      lockedSeats.value.delete(data.seatId)
    }
  })

  // Handle bulk seats update (on connect/disconnect)
  onBulkSeatsUpdate(seatIds => {
    console.log('🔄 Bulk update received, seat IDs:', seatIds)

    // Clear current locked seats
    lockedSeats.value.clear()

    // Add all seats from the array
    seatIds.forEach(seatId => {
      lockedSeats.value.add(seatId)
    })

    console.log('🔒 Updated locked seats:', Array.from(lockedSeats.value))
  })

  if (route.query.cinemaId) {
    idCinemaActive.value = route.query.cinemaId as string
  }
  if (route.query.date) {
    const dateIndex = showTimeData.value.findIndex(item => item.fullDate === (route.query.date as string).replace(/-/g, ':'))
    if (dateIndex !== -1) {
      selectedDateIndex.value = dateIndex
    }
  }
})

onUnmounted(() => {
  stopCountdown()
  // Cleanup socket listeners
  if (showTime.value?.id) {
    leaveShowtimeRoom(showTime.value.id)
  }
  offSeatSelected()
  offBulkSeatsUpdate()
})

// Watch showtime changes
watch(showTime, async (newShowTime, oldShowTime) => {
  selectedSeats.value = new Set()

  // Leave old room
  if (oldShowTime?.id) {
    leaveShowtimeRoom(oldShowTime.id)
  }

  if (!newShowTime?.id) {
    stopCountdown()
    room.value = null
    lockedSeats.value.clear()
    isLoadingRoom.value = false
    return
  }

  try {
    isLoadingRoom.value = true

    // Join new room
    joinShowtimeRoom(newShowTime.id)

    const roomResponse = showtimeData.value
      ?.find(item => item.cinemaId === idCinemaActive.value)
      ?.showtimeDetails.find(detail => detail.id === newShowTime.id)?.roomResponse

    if (roomResponse) {
      room.value = roomResponse
      startCountdown()
    } else {
      toast.add({
        title: t('error'),
        description: 'Không thể tải thông tin phòng chiếu',
        color: 'error'
      })
    }
  } catch (error) {
    console.error(error)
    toast.add({
      title: t('error'),
      description: 'Có lỗi xảy ra khi tải thông tin phòng chiếu',
      color: 'error'
    })
  } finally {
    isLoadingRoom.value = false
  }
})

// Seat interface
interface Seat {
  row: number
  col: number
  type: TypeSeat
  price: number
  status?: TypeSeatStatus
  rowLabel?: string
  colLabel?: number
  seatId?: string
}

// Seat selection mode
const selectionMode = ref<'click' | 'drag'>('click')

// Convert room seats to record format
const seatsRecord = computed(() => {
  if (!room.value?.seats || room.value.seats.length === 0) return {}

  const record: Record<string, Seat> = {}
  room.value.seats.forEach(seat => {
    const rowIdx = seat.rowIdx - 1
    const colIdx = seat.colIdx - 1
    const key = `${rowIdx}-${colIdx}`

    // Kiểm tra xem ghế có đang bị người khác lock không
    const isLockedByOthers = lockedSeats.value.has(seat.seatId || '')

    record[key] = {
      row: seat.rowIdx,
      col: seat.colIdx,
      type: seat.seatType.toUpperCase() as TypeSeat,
      price: seat.price || 0,
      status: seat.booked
        ? 'BOOKED'
        : isLockedByOthers
          ? 'LOCKED'
          : (seat.status as 'AVAILABLE' | 'BOOKED' | 'LOCKED') || 'AVAILABLE',
      rowLabel: String.fromCharCode(65 + rowIdx),
      colLabel: seat.colIdx,
      seatId: seat.seatId
    }
  })
  return record
})

const selectedSeatsInfo = computed(() => {
  const seats: Array<{ id: string; backendSeatId: string; name: string; type: string; price: number }> = []
  let totalPrice = 0

  selectedSeats.value.forEach(seatId => {
    const seat = seatsRecord.value[seatId]
    if (seat) {
      const seatName = `${seat.rowLabel}-${seat.colLabel}`
      seats.push({
        id: seatId,
        backendSeatId: seat.seatId || '',
        name: seatName,
        type: seat.type,
        price: seat.price
      })
      totalPrice += seat.price
    }
  })

  return { seats, totalPrice, count: seats.length }
})

// Watch selectedSeats để emit socket khi có thay đổi
watch(
  selectedSeats,
  (newSeats, oldSeats) => {
    if (!showTime.value?.id) return

    // Tìm ghế vừa được thêm
    const addedSeats = [...newSeats].filter(seat => !oldSeats.has(seat))
    addedSeats.forEach(seatKey => {
      const seat = seatsRecord.value[seatKey]
      if (seat?.seatId) {
        selectSeat(showTime.value!.id, seat.seatId, true)
      }
    })

    // Tìm ghế vừa bị bỏ chọn
    const removedSeats = [...oldSeats].filter(seat => !newSeats.has(seat))
    removedSeats.forEach(seatKey => {
      const seat = seatsRecord.value[seatKey]
      if (seat?.seatId) {
        selectSeat(showTime.value!.id, seat.seatId, false)
      }
    })
  },
  { deep: true }
)

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

// Handlers
const handleCinemaSelect = (cinemaId: string) => {
  idCinemaActive.value = cinemaId
  room.value = null
  showTime.value = null
}

const handleChangeShowTimeId = (_showTime: TimeSlot) => {
  showTime.value = _showTime
}

const handleBack = () => {
  showTime.value = null
  room.value = null
}

const handleBooking = async () => {
  if (!showTime.value?.id || selectedSeatsInfo.value.count === 0) return

  const seatIds = selectedSeatsInfo.value.seats.map(seat => seat.backendSeatId)

  isBooking.value = true
  try {
    const { message, value } = await apiBooking.booking({
      showtimeId: showTime.value.id,
      seatIds
    })

    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })

    window.open(value, '_self', 'noopener,noreferrer')
  } catch (error) {
    console.error('Booking error:', error)
  } finally {
    isBooking.value = false
  }
}

const input = ref('')

const onSubmit = async () => {
  if (!isAuthenticated.value) {
    isOpenModalSignIn.value = true
    return
  }

  const content = input.value.trim()
  if (!content) return

  try {
    const { message } = await apiComment.createComment({
      content,
      movieId: movieId.value as string
      // parentCommentId: ''
    })

    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })

    // Reset form
    input.value = ''

    await handleRefreshComments()
  } catch (error) {
    console.log(error)
    toast.add({
      title: t('error'),
      description: t('failed-to-post-comment'),
      color: 'error'
    })
  }
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
        <p>
          <span class="text-text-seconary text-sm">{{ t('director') }}</span
          >: {{ movieDetail.director }}
        </p>
        <p>
          <span class="text-text-seconary text-sm">{{ t('cast') }}</span
          >: {{ movieDetail.performer }}
        </p>
        <p>
          <span class="text-text-seconary text-sm">{{ t('start-time') }}</span
          >: {{ useFormatDate(movieDetail.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}
        </p>
        <p>
          <span class="text-text-seconary text-sm">{{ t('end-time') }}</span
          >: {{ useFormatDate(movieDetail.releaseDate, 'DD/MM/YYYY hh:mm:ss') }}
        </p>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="text-text-error line-clamp-3" v-html="movieDetail.note" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="mt-6" v-html="movieDetail.description" />
      </div>
    </div>

    <!-- Cinema Selection -->
    <div v-if="showtimeData && showtimeData.length > 0" class="max-w-4xl mx-auto my-6">
      <h3 class="text-xl font-semibold mb-4">{{ t('select-cinema') }}</h3>
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
      <h3 class="text-xl font-semibold mb-4">{{ t('showtime') }}</h3>

      <!-- Horizontal Date Cards -->
      <div class="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div
          v-for="(day, dayIndex) in showTimeData"
          :key="dayIndex"
          :class="[
            'flex flex-col items-center justify-center min-w-[100px] px-4 py-3 rounded-lg transition-colors',
            showTime?.id && room?.roomId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            selectedDateIndex === dayIndex
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="!(showTime?.id && room?.roomId) && (selectedDateIndex = dayIndex)"
        >
          <span class="text-sm font-medium">Th. {{ day.fullDate.split(':')[1] }}</span>
          <span class="text-2xl font-bold my-1">{{ day.fullDate.split(':')[2] }}</span>
          <span class="text-sm">{{ day.weekday }}</span>
        </div>
      </div>
      <!-- Time Slots for Selected Date -->
      <div v-if="selectedDate && !showTime?.id" class="mt-6">
        <h3 class="text-xl font-semibold mb-4">{{ t('screening-time') }}</h3>
        <div class="flex flex-wrap gap-3">
          <BaseButton
            v-for="timeSlot in selectedDate.timeSlots"
            :key="timeSlot.id"
            :text="`${timeSlot.time} (${timeSlot?.roomName})`"
            :variant="showTime?.id === timeSlot.id ? 'solid' : 'outline'"
            class-name="min-w-[100px]"
            @click="handleChangeShowTimeId(timeSlot)"
          />
        </div>
      </div>
    </div>

    <!-- Seat Selection -->
    <ClientOnly>
      <div v-if="showTime?.id" class="max-w-4xl mx-auto">
        <!-- Countdown Timer Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm">{{ t('screening-time') }}:</span>
            <span class="font-bold text-lg">{{ showTime?.time }}</span>
          </div>
          <div class="flex items-center gap-2 border border-solid border-primary px-4 py-2 rounded-lg">
            <span class="text-sm">{{ t('seat-selection-time') }}:</span>
            <span class="font-bold text-lg" :class="countdownSeconds <= 60 ? 'text-red-500 animate-pulse' : ''">
              {{ formattedCountdown }}
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingRoom" class="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg my-6">
          <div class="flex flex-col items-center justify-center space-y-4 py-20">
            <UIcon name="i-lucide-loader-circle" class="size-12 animate-spin text-primary" />
            <p class="text-lg">Đang tải sơ đồ ghế...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="!room || !room.roomId" class="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg my-6">
          <div class="flex flex-col items-center justify-center space-y-4 py-20">
            <UIcon name="i-lucide-alert-circle" class="size-12 text-red-500" />
            <p class="text-lg text-red-500">Không thể tải thông tin phòng chiếu</p>
            <BaseButton text="Thử lại" @click="handleChangeShowTimeId(showTime!)" />
          </div>
        </div>

        <!-- Seat Grid -->
        <div v-else class="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
          <!-- Screen -->
          <div class="w-full mb-8 h-2 bg-linear-to-b from-gray-400 to-gray-600 rounded-t-full" />

          <BaseSeatGrid
            :rows="room.totalRow"
            :cols="room.totalCol"
            :seats="seatsRecord"
            :selected-seats="selectedSeats"
            :selection-mode="selectionMode"
            mode="booking"
            @update:selected-seats="selectedSeats = $event"
          />

          <!-- Selected Info Summary -->
          <div class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div class="space-y-4">
              <!-- Selected Seats -->
              <div>
                <p class="text-sm font-medium mb-2">{{ t('selected-seats') }}:</p>
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
                <div class="flex justify-end gap-4">
                  <BaseButton :text="t('go-back')" class-name="px-4" @click="handleBack" />
                  <BaseButton
                    :text="t('payment')"
                    variant="solid"
                    :is-loading="isBooking"
                    class-name="px-4"
                    @click="handleBooking"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

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

    <!-- Review -->
    <div class="max-w-4xl mx-auto space-y-4 my-10">
      <p class="flex justify-start items-center space-x-2">
        <UIcon name="i-lucide-message-circle-more" class="size-6" />
        <span class="text-2xl">{{ t('comment') }}</span>
      </p>
      <p v-if="!isAuthenticated">
        {{ t('please') }} <span class="text-primary cursor-pointer" @click="isOpenModalSignIn = true">{{ t('login') }}</span>
        {{ t('to-join-comment') }}
      </p>
      <div>
        <UChatPrompt v-model="input" :rows="3" :autofocus="false" @submit="onSubmit">
          <UChatPromptSubmit />
        </UChatPrompt>
      </div>

      <!-- Recursive Comment List -->
      <MovieCommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :movie-id="movieId"
        @refresh="handleRefreshComments"
      />
    </div>
  </div>
</template>

<style scoped></style>
