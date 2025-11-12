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

const transformSeats = (seats: ISeat[]): Record<string, Seat> => {
  const seatsMap: Record<string, Seat> = {}

  seats.forEach(seat => {
    const rowIdx = seat.rowIdx - 1
    const colIdx = seat.colIdx - 1
    const key = `${rowIdx}-${colIdx}`
    seatsMap[key] = {
      row: seat.rowIdx,
      col: seat.colIdx,
      type: (seat.seatType?.toUpperCase() || 'NORMAL') as TypeSeat,
      price: seat.price || 0,
      status: seat.booked ? 'BOOKED' : (seat.status as 'AVAILABLE' | 'BOOKED' | 'LOCKED') || 'AVAILABLE',
      rowLabel: String.fromCharCode(65 + rowIdx),
      colLabel: seat.colIdx
    }
  })

  return seatsMap
}

const getSeatsMap = (room: IRoom): Record<string, Seat> => {
  if (!room?.seats || !Array.isArray(room.seats)) {
    return {}
  }
  return transformSeats(room.seats)
}

const getSeatTypePrices = (room: IRoom): Record<string, number> => {
  if (!room?.seats || !Array.isArray(room.seats)) {
    return {}
  }
  const priceMap: Record<string, number> = {}
  room.seats
    .filter(s => s.seatType !== 'DISABLED')
    .forEach(seat => {
      const seatType = seat.seatType
      priceMap[seatType] = seat.price || 0
    })
  return priceMap
}

const seatType: Record<string, { label: string; color: string }> = {
  NORMAL: { label: t('normal'), color: 'bg-blue-500 text-blue-500' },
  VIP: { label: t('vip'), color: 'bg-yellow-500 text-yellow-500' },
  COUPLE: { label: t('couple'), color: 'bg-pink-500 text-pink-500' },
  DISABLED: { label: t('disabled'), color: 'bg-gray-400 text-gray-400' },
  EMPTY: { label: t('empty'), color: 'bg-gray-200 text-gray-200' }
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
const handleDelete = async () => {
  if (!roomDetail.value.roomId) return
  isProcessing.value = true
  try {
    const { message } = await apiPublic.deleteRoom(roomDetail.value.roomId)
    useToast().add({
      title: t('success'),
      description: message,
      color: 'success'
    })
    isConfirmOpen.value = false
    await Promise.all([fetchRooms(route.params.id as string, true), refreshNuxtData(`cinema-detail-${route.params.id}`)])
  } catch (error) {
    console.log(error)
  } finally {
    isProcessing.value = false
  }
}

const handleAdd = () => {
  isEditMode.value = false
  isOpen.value = true
}

const handleSave = async () => {
  isOpen.value = false
  isEditMode.value = false
  await Promise.all([fetchRooms(route.params.id as string, true), refreshNuxtData(`cinema-detail-${route.params.id}`)])
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
              <p class="flex justify-start items-center">
                <span class="mr-1">{{ seatType[type]?.label }}</span>
                (<UIcon name="i-lucide-armchair" class="size-5" :class="seatType[type]?.color" />)
                <span>:</span>
              </p>
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
