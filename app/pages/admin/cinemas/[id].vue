<script setup lang="ts">
import { apiPublic } from '~/services'
import type { ISeat, IRoom, TypeSeat, TypeSeatStatus } from '~/types/cinema.type'
import type { IActionCard } from '~/types/constant.type'

interface Seat {
  row: number
  col: number
  type: TypeSeat
  price: number
  status?: TypeSeatStatus
  rowLabel?: string
  colLabel?: number
}

definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})
const { rooms, roomDetail, fetchRooms } = useCinemaData()
const { t } = useI18n()
const route = useRoute()
const isOpen = ref(false)
const isConfirmOpen = ref(false)
const isProcessing = ref(false)

const { data: cinameDetail } = await useAsyncData(`cinema-detail-${route.params.id}`, async () => {
  const res = await apiPublic.getCinemaDetail(route.params.id as string)
  return res.value
})
fetchRooms(route.params.id as string)

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
      type: seat.seatName.toUpperCase() as TypeSeat,
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
  room.seats
    .filter(s => s.seatName !== 'DISABLED')
    .forEach(seat => {
      const seatType = seat.seatName.toUpperCase()
      priceMap[seatType] = seat.price || 0
    })
  return priceMap
}

// Seat type labels
const seatTypeLabels: Record<string, string> = {
  NORMAL: t('normal'),
  VIP: t('vip'),
  COUPLE: t('couple'),
  DISABLED: t('disabled'),
  EMPTY: t('empty')
}

const isEditMode = ref(false)

const actionClick = (action: IActionCard, data: IRoom) => {
  roomDetail.value = data
  if (action === 'EDIT') {
    isEditMode.value = true
    isOpen.value = true
  } else if (action === 'VIEW') {
    console.log(action)
  } else if (action === 'DELETE') {
    isConfirmOpen.value = true
  }
}
const handleDelete = () => {
  if (!roomDetail.value.roomId) return
  isProcessing.value = true
  apiPublic
    .deleteRoom(roomDetail.value.roomId)
    .then(({ message }) => {
      useToast().add({
        title: t('success'),
        description: message,
        color: 'success'
      })
      isConfirmOpen.value = false
      fetchRooms(route.params.id as string)
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      isProcessing.value = false
    })
}

const handleAdd = () => {
  isEditMode.value = false
  isOpen.value = true
}

const handleSave = () => {
  isOpen.value = false
  isEditMode.value = false
  fetchRooms(route.params.id as string)
}
</script>
<template>
  <div class="card-box">
    <p class="text-lg font-medium text-primary text-center">
      {{ t('theater-information') }} <span class="uppercase">{{ cinameDetail?.name }}</span>
    </p>

    <div class="border-b border-solid border-border-light dark:border-border-dark pb-4">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-4">
        <img v-for="(item, index) in cinameDetail?.urlImages" :key="index" :src="item" class="w-full h-60 object-cover rounded" />
      </div>
      <p>
        <span class="text-secondary text-sm">{{ $t('address') }}: </span>
        <span>{{ cinameDetail?.province }} - {{ cinameDetail?.commune }} - {{ cinameDetail?.detailAddress }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('phone') }}: </span>
        <span>{{ cinameDetail?.phone }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('status') }}: </span>
        <span>{{ cinameDetail?.status }}</span>
      </p>
      <p>
        <span class="text-secondary text-sm">{{ $t('description') }}: </span>
        <span>{{ cinameDetail?.description }}</span>
      </p>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-lg font-medium text-primary">{{ t('room-management') }}</p>
      <BaseButton :text="t('add')" variant="solid" class-name="rounded" @click="handleAdd" />
    </div>

    <div v-for="item in rooms" :key="item.roomId">
      <BaseCard :item="item" :index="0" class="w-full" :can-scale="false" :show-border="true" @action-click="actionClick">
        <template #content>
          <p>{{ t('room-name') }}: {{ item.name }}</p>

          <p>{{ t('total-seat') }}: {{ item.totalCol * item.totalRow }} ( {{ item.totalRow }} x {{ item.totalCol }})</p>

          <div class="space-x-2 mt-2">
            <UButton v-for="(price, type) in getSeatTypePrices(item)" :key="type" size="sm" :variant="'outline'">
              <span class="font-medium text-sm">{{ seatTypeLabels[type] }}:</span>

              <span class="text-primary font-bold">{{ formatPrice(price) }} </span>
            </UButton>
          </div>

          <BaseSeatGrid :rows="item.totalRow" :cols="item.totalCol" :seats="getSeatsMap(item)" mode="admin" />
        </template>
      </BaseCard>
    </div>
    <CinemaModalAddRoom v-model:is-open="isOpen" :is-edit-mode="isEditMode" @saved="handleSave" />
    <BaseConfirmModal
      v-model:open="isConfirmOpen"
      variant="danger"
      :title="t('delete-room-title')"
      :description="formatConfirmContent(t('delete-room-confirm', { name: roomDetail.name }), roomDetail.name)"
      :confirm-text="t('delete')"
      :cancel-text="t('cancel-button')"
      :is-loading="isProcessing"
      @confirm="handleDelete"
    />
  </div>
</template>

<style scoped></style>
