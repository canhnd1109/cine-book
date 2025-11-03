<script setup lang="ts">
import type { ISeat, IRoom } from '~/types/cinema.type'

interface Seat {
  row: number
  col: number
  type: 'NORMAL' | 'VIP' | 'COUPLE' | 'DISABLED' | 'EMPTY' | 'UNSET'
  price: number
  status?: 'AVAILABLE' | 'BOOKED' | 'LOCKED'
  rowLabel?: string
  colLabel?: number
}

definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})
const { cinameDetail, rooms } = useCinemaData()
const { t } = useI18n()

const isOpen = ref(false)

// Transform seats array to Record format for BaseSeatGrid
const transformSeats = (seats: ISeat[]): Record<string, Seat> => {
  const seatsMap: Record<string, Seat> = {}

  seats.forEach(seat => {
    // Convert from 1-indexed (API) to 0-indexed (BaseSeatGrid expects)
    const rowIdx = seat.rowIdx - 1
    const colIdx = seat.colIdx - 1
    const key = `${rowIdx}-${colIdx}`
    seatsMap[key] = {
      row: seat.rowIdx, // Keep 1-indexed for display
      col: seat.colIdx,
      type: (seat.seatName || 'UNSET').toUpperCase() as 'NORMAL' | 'VIP' | 'COUPLE' | 'DISABLED' | 'EMPTY' | 'UNSET',
      price: seat.price || 0,
      status: seat.booked ? 'BOOKED' : (seat.status as 'AVAILABLE' | 'BOOKED' | 'LOCKED') || 'AVAILABLE',
      rowLabel: String.fromCharCode(65 + rowIdx),
      colLabel: seat.colIdx
    }
  })

  return seatsMap
}

// Get seats map for a specific room
const getSeatsMap = (room: IRoom): Record<string, Seat> => {
  if (!room?.seats || !Array.isArray(room.seats)) {
    return {}
  }
  return transformSeats(room.seats)
}

// Get unique prices by seat type for a room
const getSeatTypePrices = (room: IRoom): Record<string, number> => {
  if (!room?.seats || !Array.isArray(room.seats)) {
    return {}
  }
  const priceMap: Record<string, number> = {}
  room.seats.forEach(seat => {
    const seatType = (seat.seatName || 'UNSET').toUpperCase()
    priceMap[seatType] = seat.price || 0
  })
  return priceMap
}

// Seat type labels
const seatTypeLabels: Record<string, string> = {
  NORMAL: 'Ghế thường',
  VIP: 'Ghế VIP',
  COUPLE: 'Ghế đôi',
  DISABLED: 'Không hoạt động',
  EMPTY: 'Vị trí trống',
  UNSET: 'Chưa thiết lập'
}
</script>
<template>
  <div class="card-box">
    <p class="text-lg font-medium text-primary text-center">
      {{ t('theater-information') }} <span class="uppercase">{{ cinameDetail.name }}</span>
    </p>

    <div class="border-b border-solid border-border-light dark:border-border-dark pb-4">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-4">
        <img v-for="(item, index) in cinameDetail.urlImages" :key="index" :src="item" class="w-full h-60 object-cover rounded" />
      </div>
      <p>
        <span class="text-secondary text-sm">{{ $t('address') }}: </span>
        <span>{{ cinameDetail.province }} - {{ cinameDetail.commune }} - {{ cinameDetail.detailAddress }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('phone') }}: </span>
        <span>{{ cinameDetail.phone }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('status') }}: </span>
        <span>{{ cinameDetail.status }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('description') }}: </span>
        <span>{{ cinameDetail.description }}</span>
      </p>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-lg font-medium text-primary">{{ t('room-management') }}</p>
      <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="isOpen = true" />
    </div>

    <div v-for="item in rooms" :key="item.roomId">
      <BaseCard :item="item" :index="0" class="w-full" :can-scale="false" :show-border="true">
        <template #content>
          <p>Name: {{ item.name }}</p>

          <p>Tổng số ghế: {{ item.totalCol * item.totalRow }} ( {{ item.totalRow }} x {{ item.totalCol }})</p>

          <!-- Seat type prices -->
          <div class="flex flex-wrap gap-4 my-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div v-for="(price, type) in getSeatTypePrices(item)" :key="type" class="flex items-center gap-2">
              <span class="font-medium text-sm">{{ seatTypeLabels[type] || type }}:</span>
              <span class="text-primary font-bold">{{ price.toLocaleString('vi-VN') }} đ</span>
            </div>
          </div>

          <BaseSeatGrid :rows="item.totalRow" :cols="item.totalCol" :seats="getSeatsMap(item)" mode="booking" />
        </template>
      </BaseCard>
    </div>
    <CinemaModalAddRoom v-model:is-open="isOpen" />
  </div>
</template>

<style scoped></style>
