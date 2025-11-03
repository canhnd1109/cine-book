<script setup lang="ts">
import { cinemaRoomSchema, type CinemaRoomInput } from '~/schemas/cinema.chema'
import { SEAT_TYPE } from '~/constants'
import { apiRoom } from '~/services'
const { schema } = useSchema(cinemaRoomSchema)
const { cinameDetail, typeSeat, priceSeat, restSeat } = useCinemaData()
const toast = useToast()

const isProcessing = ref(false)
const { t } = useI18n()
const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const formRef = ref()

const room = ref<CinemaRoomInput>({
  name: '',
  totalRow: 8,
  totalCol: 12
})

type SeatType = 'NORMAL' | 'VIP' | 'COUPLE' | 'DISABLED' | 'EMPTY' | 'UNSET'

interface LocalSeat {
  row: number
  col: number
  type: SeatType
  price: number
  status?: 'AVAILABLE' | 'BOOKED' | 'LOCKED'
  rowLabel?: string
  colLabel?: number
}

// State
const seats = ref<Record<string, LocalSeat>>({})
const selectedSeats = ref(new Set<string>())
const selectionMode = ref<'click' | 'drag'>('click')

// Watch room dimensions change
watch(
  () => [room.value.totalRow ?? 0, room.value.totalCol ?? 0],
  ([newRows, newCols]) => {
    if ((newRows ?? 0) > 0 && (newCols ?? 0) > 0) {
      initializeSeats()
    }
  }
)

const clearSelection = () => {
  selectedSeats.value = new Set()
}

// Sync typeSeat and priceSeat from selected seats
const syncSeatInputsFromSelection = () => {
  if (selectedSeats.value.size === 0) {
    restSeat()
    return
  }

  // Get unique types and prices from selected seats
  const seatTypes = new Set<string>()
  const seatPrices = new Set<number>()

  selectedSeats.value.forEach(seatId => {
    const seat = seats.value[seatId]
    if (seat && seat.type !== 'UNSET') {
      seatTypes.add(seat.type)
      seatPrices.add(seat.price)
    }
  })

  // If all selected seats have the same type and price, fill the inputs
  if (seatTypes.size === 1 && seatPrices.size === 1) {
    const typeArray = Array.from(seatTypes)
    const priceArray = Array.from(seatPrices)
    if (typeArray[0] && priceArray[0] !== undefined) {
      typeSeat.value = typeArray[0]
      priceSeat.value = String(priceArray[0])
    }
  } else {
    // If seats have different types or prices, clear inputs
    restSeat()
  }
}

// Methods
const initializeSeats = () => {
  const newSeats: Record<string, LocalSeat> = {}
  for (let row = 0; row < room.value.totalRow; row++) {
    for (let col = 0; col < room.value.totalCol; col++) {
      const seatId = `${row}-${col}`
      newSeats[seatId] = {
        row: row + 1,
        col: col + 1,
        type: 'UNSET',
        price: 0,
        status: 'AVAILABLE',
        rowLabel: String.fromCharCode(65 + row),
        colLabel: col + 1
      }
    }
  }
  clearSelection()
  seats.value = newSeats
}

const selectRow = (rowIndex: number) => {
  const newSelected = new Set<string>()
  for (let col = 0; col < room.value.totalCol; col++) {
    newSelected.add(`${rowIndex}-${col}`)
  }
  selectedSeats.value = newSelected
  syncSeatInputsFromSelection()
}

const selectCol = (colIndex: number) => {
  const newSelected = new Set<string>()
  for (let row = 0; row < room.value.totalRow; row++) {
    newSelected.add(`${row}-${colIndex}`)
  }
  selectedSeats.value = newSelected
  syncSeatInputsFromSelection()
}

const selectAll = () => {
  const newSelected = new Set<string>()
  for (let row = 0; row < room.value.totalRow; row++) {
    for (let col = 0; col < room.value.totalCol; col++) {
      newSelected.add(`${row}-${col}`)
    }
  }
  selectedSeats.value = newSelected
  syncSeatInputsFromSelection()
}

const handleSave = async () => {
  // Only send seats that have been configured (type !== 'UNSET')
  const formattedSeats = Object.entries(seats.value).map(([_key, seat]) => ({
    rowIdx: seat.row,
    colIdx: seat.col,
    seatName: seat.type,
    price: seat.price
  }))

  const body = {
    cinemaId: cinameDetail.value.id,
    name: room.value.name,
    totalRow: room.value.totalRow,
    totalCol: room.value.totalCol,
    seats: formattedSeats
  }
  isProcessing.value = true
  try {
    const { message } = await apiRoom.addRoom(body)
    toast.add({
      title: t('success'),
      description: message,
      color: 'success'
    })
  } catch (error) {
    console.log(error)
  } finally {
    isProcessing.value = false
  }
}

const handleSeatTypeChange = () => {
  if (selectedSeats.value.size > 0 && typeSeat.value) {
    // Cập nhật seats với loại ghế mới được chọn
    const newSeats = { ...seats.value }
    selectedSeats.value.forEach(seatId => {
      const existingSeat = newSeats[seatId]
      if (existingSeat) {
        newSeats[seatId] = {
          ...existingSeat,
          type: typeSeat.value as SeatType,
          price: Number(priceSeat.value)
        }
      }
    })
    seats.value = newSeats
  }
}

// Thêm watch để tự động cập nhật khi chọn type
watch([typeSeat, priceSeat], () => {
  handleSeatTypeChange()
})

// Watch selectedSeats to sync inputs when selection changes (from grid clicks)
watch(
  selectedSeats,
  () => {
    syncSeatInputsFromSelection()
  },
  { deep: true }
)

// Initialize on mount
onMounted(() => {
  if (room.value.totalRow > 0 && room.value.totalCol > 0) {
    initializeSeats()
  }
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('add-room')">
    <template #body>
      <UForm ref="formRef" :schema :state="room" class="grid grid-cols-3 gap-4">
        <UFormField :label="t('cinema-name')" name="name">
          <UInput v-model="room.name" :placeholder="t('cinema-name')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>

        <UFormField :label="t('row')" name="totalRow">
          <UInput v-model.number="room.totalRow" :placeholder="t('row')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>
        <UFormField :label="t('column')" name="totalCol">
          <UInput v-model.number="room.totalCol" :placeholder="t('column')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>
      </UForm>

      <div v-if="room.totalRow > 0 && room.totalCol > 0" class="mt-6">
        <div class="flex gap-4 w-full">
          <UCard class="mb-4">
            <div class="flex flex-wrap gap-3 items-center">
              <div class="flex gap-2">
                <UButton :variant="selectionMode === 'click' ? 'solid' : 'outline'" @click="selectionMode = 'click'">
                  Click (Ctrl/Shift)
                </UButton>
                <UButton :variant="selectionMode === 'drag' ? 'solid' : 'outline'" @click="selectionMode = 'drag'">
                  Kéo vùng
                </UButton>
              </div>

              <UButton icon="i-heroicons-check-circle" @click="selectAll"> Chọn tất cả </UButton>

              <UButton icon="i-heroicons-x-circle" @click="clearSelection"> Bỏ chọn </UButton>

              <!-- <UButton icon="i-heroicons-cog-6-tooth" :disabled="selectedSeats.size === 0" @click="showBatchConfig = true">
                Cấu hình ({{ selectedSeats.size }})
              </UButton> -->
            </div>
          </UCard>

          <UCard class="mb-4 w-full">
            <template #header>
              <p class="text-sm font-semibold">Chọn nhanh:</p>
            </template>

            <div class="flex flex-wrap gap-2">
              <UButton v-for="i in room.totalRow" :key="`row-${i}`" size="sm" variant="outline" @click="selectRow(i - 1)">
                Hàng {{ String.fromCharCode(64 + i) }}
              </UButton>

              <UButton v-for="i in room.totalCol" :key="`col-${i}`" size="sm" variant="outline" @click="selectCol(i - 1)">
                Cột {{ i }}
              </UButton>
            </div>
          </UCard>
        </div>
        <div class="flex gap-4">
          <UCard class="mb-4 w-full">
            <BaseSeatGrid
              :rows="room.totalRow"
              :cols="room.totalCol"
              :seats="seats"
              :selected-seats="selectedSeats"
              :selection-mode="selectionMode"
              mode="admin"
              @update:selected-seats="selectedSeats = $event"
              @seat-click="restSeat"
            />
          </UCard>
          <UCard class="mb-4 w-1/3 h-fit">
            <UFormField label="Loại ghế" name="price">
              <BaseSelect
                v-model="typeSeat"
                :items="SEAT_TYPE"
                label-key="label"
                value-key="value"
                placeholder="Chọn loại ghế"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="t('price')" name="price" class="my-4">
              <UInput v-model="priceSeat" :placeholder="t('price')" :ui="{ base: 'h-10' }" class="w-full" />
            </UFormField>

            <!-- <div class="flex justify-end">
              <BaseButton text="Lưu cấu hình" class="w-36" variant="solid" class-name="rounded" @click="handleSaveConfig" />
            </div> -->
          </UCard>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end w-full">
        <BaseButton :text="t('add')" class="w-20" variant="solid" class-name="rounded" @click="handleSave" />
      </div>
    </template>
  </UModal>
</template>
