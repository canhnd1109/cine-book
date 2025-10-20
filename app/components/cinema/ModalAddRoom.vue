<script setup lang="ts">
import { cinemaRoomSchema, type CinemaRoomInput } from '~/schemas/cinema.chema'
import { SEAT_TYPE } from '~/constants'
const { schema } = useSchema(cinemaRoomSchema)

interface SeatType {
  label: string
  color: string
  price: number
}
const type = ref('')
const price = ref('')

const emit = defineEmits<{
  save: [data: { room: CinemaRoomInput; seats: Record<string, any> }]
}>()

const { t } = useI18n()
const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const formRef = ref()

const room = ref<CinemaRoomInput>({
  name: '',
  rows: 8,
  columns: 12
})

const seatTypes: Record<string, SeatType> = {
  NORMAL: { label: 'Ghế thường', color: 'bg-blue-500', price: 50000 },
  VIP: { label: 'Ghế VIP', color: 'bg-yellow-500', price: 100000 },
  COUPLE: { label: 'Ghế đôi', color: 'bg-pink-500', price: 150000 },
  DISABLED: { label: 'Không hoạt động', color: 'bg-gray-400', price: 0 },
  EMPTY: { label: 'Vị trí trống', color: 'bg-transparent border-2 border-dashed border-gray-300', price: 0 }
}

// State
const seats = ref<Record<string, any>>({})
const selectedSeats = ref(new Set<string>())
const selectionMode = ref<'click' | 'drag'>('click')

// Watch room dimensions change
watch(
  () => [room.value.rows ?? 0, room.value.columns ?? 0],
  ([newRows, newCols]) => {
    if ((newRows ?? 0) > 0 && (newCols ?? 0) > 0) {
      initializeSeats()
    }
  }
)

const clearSelection = () => {
  selectedSeats.value = new Set()
}

// Methods
const initializeSeats = () => {
  const newSeats: Record<string, any> = {}
  for (let row = 0; row < room.value.rows; row++) {
    for (let col = 0; col < room.value.columns; col++) {
      const seatId = `${row}-${col}`
      newSeats[seatId] = {
        row,
        col,
        type: 'DISABLED',
        price: seatTypes?.NORMAL?.price ?? 0,
        status: 'BOOKED',
        rowLabel: String.fromCharCode(65 + row),
        colLabel: col + 1
      }
    }
    clearSelection()
    seats.value = newSeats
  }
}

const selectRow = (rowIndex: number) => {
  const newSelected = new Set<string>()
  for (let col = 0; col < room.value.columns; col++) {
    newSelected.add(`${rowIndex}-${col}`)
  }
  selectedSeats.value = newSelected
}

const selectCol = (colIndex: number) => {
  const newSelected = new Set<string>()
  for (let row = 0; row < room.value.rows; row++) {
    newSelected.add(`${row}-${colIndex}`)
  }
  selectedSeats.value = newSelected
}

const selectAll = () => {
  const newSelected = new Set<string>()
  for (let row = 0; row < room.value.rows; row++) {
    for (let col = 0; col < room.value.columns; col++) {
      newSelected.add(`${row}-${col}`)
    }
  }
  selectedSeats.value = newSelected
}

const handleSeatClick = (data: any) => {
  console.log('Seat clicked:', data)
}

const handleSave = () => {
  emit('save', {
    room: room.value,
    seats: seats.value
  })
  handleClose()
}

const handleClose = () => {
  isOpen.value = false
}

// Initialize on mount
onMounted(() => {
  if (room.value.rows > 0 && room.value.columns > 0) {
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

        <UFormField :label="t('row')" name="rows">
          <UInput v-model.number="room.rows" :placeholder="t('row')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>
        <UFormField :label="t('column')" name="columns">
          <UInput v-model.number="room.columns" :placeholder="t('column')" :ui="{ base: 'h-10' }" class="w-full" />
        </UFormField>
      </UForm>

      <div v-if="room.rows > 0 && room.columns > 0" class="mt-6">
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
              <UButton v-for="i in room.rows" :key="`row-${i}`" size="sm" variant="outline" @click="selectRow(i - 1)">
                Hàng {{ String.fromCharCode(64 + i) }}
              </UButton>

              <UButton v-for="i in room.columns" :key="`col-${i}`" size="sm" variant="outline" @click="selectCol(i - 1)">
                Cột {{ i }}
              </UButton>
            </div>
          </UCard>
        </div>
        <div class="flex gap-4">
          <UCard class="mb-4 w-full">
            <BaseSeatGrid
              :rows="room.rows"
              :cols="room.columns"
              :seats="seats"
              :selected-seats="selectedSeats"
              :selection-mode="selectionMode"
              mode="admin"
              @update:selected-seats="selectedSeats = $event"
              @room-click="handleSeatClick"
            />
          </UCard>
          <UCard class="mb-4 w-1/3">
            <UFormField label="Loại ghế" name="price">
              <BaseSelect
                v-model="type"
                :items="SEAT_TYPE"
                label-key="label"
                value-key="value"
                placeholder="Chọn loại ghế"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="t('price')" name="price" class="my-4">
              <UInput v-model="price" :placeholder="t('price')" :ui="{ base: 'h-10' }" class="w-full" />
            </UFormField>

            <div class="flex justify-end">
              <BaseButton text="Lưu cấu hình" class="w-36" variant="solid" class-name="rounded" />
            </div>
          </UCard>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end w-full">
        <BaseButton :text="t('add')" class="w-20" variant="solid" class-name="rounded " />
      </div>
    </template>
  </UModal>
</template>
