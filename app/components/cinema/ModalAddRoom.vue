<script setup lang="ts">
import { cinemaRoomSchema, type CinemaRoomInput } from '~/schemas/cinema.chema'
import { SEAT_TYPE } from '~/constants'
import { apiRoom } from '~/services'
import type { TypeSeat, TypeSeatStatus } from '~/types/cinema.type'

const { schema } = useSchema(cinemaRoomSchema)
const { cinameDetail, typeSeat, priceSeat, restSeat } = useCinemaData()
const toast = useToast()
const { t } = useI18n()

const isProcessing = ref(false)
const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const formRef = ref()

const emit = defineEmits<{
  saved: []
}>()

const room = ref<CinemaRoomInput>({
  name: '',
  totalRow: 8,
  totalCol: 12
})

interface LocalSeat {
  row: number
  col: number
  type: TypeSeat
  price: number
  status?: TypeSeatStatus
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
    if (seat && seat.type !== 'DISABLED') {
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
        type: 'NORMAL',
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

// Check if a row is fully selected
const isRowSelected = (rowIndex: number): boolean => {
  if (selectedSeats.value.size === 0) return false
  for (let col = 0; col < room.value.totalCol; col++) {
    if (!selectedSeats.value.has(`${rowIndex}-${col}`)) {
      return false
    }
  }
  return true
}

// Check if a column is fully selected
const isColSelected = (colIndex: number): boolean => {
  if (selectedSeats.value.size === 0) return false
  for (let row = 0; row < room.value.totalRow; row++) {
    if (!selectedSeats.value.has(`${row}-${colIndex}`)) {
      return false
    }
  }
  return true
}

const handleSave = async () => {
  // Validate: Check if all seats have price greater than 0
  const seatsWithoutPrice = Object.entries(seats.value).filter(([_key, seat]) => seat.type !== 'DISABLED' && seat.price <= 0)

  if (seatsWithoutPrice.length > 0) {
    toast.add({
      title: t('error'),
      description: 'Vui lòng nhập giá cho tất cả các ghế',
      color: 'error'
    })
    return
  }

  // Only send seats that have been configured (type !== 'DISABLED')
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
    emit('saved')
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
          type: typeSeat.value as TypeSeat,
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

const formattedPrice = computed({
  get: () => {
    if (!priceSeat.value) return 0
    return new Intl.NumberFormat('vi-VN').format(+priceSeat.value)
  },
  set: (value: string) => {
    const numberValue = value.replace(/[^\d]/g, '')
    priceSeat.value = numberValue ? numberValue : ''
  }
})

const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit()
  }
}
onMounted(() => {
  if (room.value.totalRow > 0 && room.value.totalCol > 0) {
    initializeSeats()
  }
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('add-room')">
    <template #body>
      <UForm ref="formRef" :schema :state="room" class="grid grid-cols-3 gap-4" @submit="handleSave">
        <UFormField :label="t('room-name')" name="name">
          <UInput v-model="room.name" :placeholder="t('room-name')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>

        <UFormField :label="t('row-number')" name="totalRow">
          <UInput v-model.number="room.totalRow" :placeholder="t('row-number')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>
        <UFormField :label="t('column-number')" name="totalCol">
          <UInput v-model.number="room.totalCol" :placeholder="t('column-number')" :ui="{ base: 'h-10' }" class="w-full" />
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
                  {{ t('drag') }}
                </UButton>
              </div>

              <UButton icon="i-heroicons-check-circle" @click="selectAll">{{ t('select-all') }}</UButton>

              <UButton icon="i-heroicons-x-circle" @click="clearSelection">{{ t('clear-selection') }}</UButton>

              <!-- <UButton icon="i-heroicons-cog-6-tooth" :disabled="selectedSeats.size === 0" @click="showBatchConfig = true">
                Cấu hình ({{ selectedSeats.size }})
              </UButton> -->
            </div>
          </UCard>

          <UCard class="mb-4 w-full">
            <template #header>
              <p class="text-sm font-semibold">{{ t('quick-select') }}:</p>
            </template>

            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="i in room.totalRow"
                :key="`row-${i}`"
                size="sm"
                :variant="isRowSelected(i - 1) ? 'solid' : 'outline'"
                @click="selectRow(i - 1)"
              >
                {{ t('row') }} {{ String.fromCharCode(64 + i) }}
              </UButton>

              <UButton
                v-for="i in room.totalCol"
                :key="`col-${i}`"
                size="sm"
                :variant="isColSelected(i - 1) ? 'solid' : 'outline'"
                @click="selectCol(i - 1)"
              >
                {{ t('column') }} {{ i }}
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
              <UInput v-model="formattedPrice" :placeholder="t('price')" :ui="{ base: 'h-10' }" class="w-full" />
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
        <BaseButton
          :text="t('add')"
          :is-loading="isProcessing"
          class="w-20"
          variant="solid"
          class-name="rounded"
          @click="submitForm"
        />
      </div>
    </template>
  </UModal>
</template>
