<template>
  <div>
    <!-- Screen -->
    <div class="mb-6 flex flex-col items-center">
      <div class="w-full max-w-4xl h-3 bg-gradient-to-b from-gray-800 to-gray-600 rounded-t-3xl shadow-lg" />
      <UBadge color="gray" variant="subtle" class="mt-2">Màn hình</UBadge>
    </div>

    <!-- Seat Grid -->
    <div class="flex justify-center select-none mb-6" @mouseup="handleMouseUp">
      <div class="inline-block">
        <div v-for="row in rows" :key="`row-${row}`" class="flex items-center">
          <UBadge color="gray" variant="subtle" class="w-8 text-center font-bold">
            {{ String.fromCharCode(64 + row) }}
          </UBadge>

          <div class="flex">
            <div
              v-for="col in cols"
              :key="`seat-${row}-${col}`"
              :class="getSeatClass(row - 1, col - 1)"
              @click="handleSeatClick(row - 1, col - 1, $event)"
              @mousedown="handleMouseDown(row - 1, col - 1)"
              @mouseenter="handleMouseEnter(row - 1, col - 1)"
            >
              <div
                v-if="getSeat(row - 1, col - 1)?.type !== 'EMPTY'"
                class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
              >
                {{ String.fromCharCode(64 + row) }}{{ col }}
              </div>

              <!-- Status indicator for booked seats -->
              <div
                v-if="mode === 'booking' && getSeat(row - 1, col - 1)?.status === 'BOOKED'"
                class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 justify-center">
      <div v-for="(type, key) in displayedSeatTypes" :key="key" class="flex items-center gap-2">
        <div :class="['w-6 h-6 rounded', type.color]" />
        <span class="text-sm text-gray-700">{{ type.label }}</span>
      </div>

      <!-- Additional legend for booking mode -->
      <template v-if="mode === 'booking'">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded bg-gray-600 relative">
            <div class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <span class="text-sm text-gray-700">Đã đặt</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded bg-blue-500 ring-4 ring-green-400" />
          <span class="text-sm text-gray-700">Đang chọn</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Number,
    required: true
  },
  cols: {
    type: Number,
    required: true
  },
  seats: {
    type: Object,
    required: true
  },
  selectedSeats: {
    type: Set,
    default: () => new Set()
  },
  mode: {
    type: String,
    default: 'admin', // 'admin' or 'booking'
    validator: value => ['admin', 'booking'].includes(value)
  },
  selectionMode: {
    type: String,
    default: 'click'
  },
  enableMultiSelect: {
    type: Boolean,
    default: true
  },
  maxSeatsSelect: {
    type: Number,
    default: null // null = unlimited
  }
})

const emit = defineEmits(['update:selectedSeats', 'seatClick'])

const seatTypes = {
  NORMAL: { label: 'Ghế thường', color: 'bg-blue-500', price: 50000 },
  VIP: { label: 'Ghế VIP', color: 'bg-yellow-500', price: 100000 },
  COUPLE: { label: 'Ghế đôi', color: 'bg-pink-500', price: 150000 },
  DISABLED: { label: 'Không hoạt động', color: 'bg-gray-400', price: 0 },
  EMPTY: { label: 'Vị trí trống', color: 'bg-transparent border-2 border-dashed border-gray-300', price: 0 }
}

// State
const isSelecting = ref(false)
const selectionStart = ref(null)

// Computed
const displayedSeatTypes = computed(() => {
  if (props.mode === 'booking') {
    // Hide EMPTY and DISABLED in booking mode
    const { EMPTY, DISABLED, ...bookingSeatTypes } = seatTypes
    return bookingSeatTypes
  }
  return seatTypes
})

// Methods
const getSeat = (row, col) => {
  const seatId = `${row}-${col}`
  return props.seats[seatId]
}

const getSeatClass = (row, col) => {
  const seatId = `${row}-${col}`
  const seat = getSeat(row, col)
  const isSelected = props.selectedSeats.has(seatId)

  if (!seat) return ''

  const seatType = seatTypes[seat.type]
  const isEmpty = seat.type === 'EMPTY'
  const isDisabled = seat.type === 'DISABLED'
  const isBooked = props.mode === 'booking' && seat.status === 'BOOKED'

  // Base classes
  const baseClasses = ['relative w-10 h-10 m-0.5 rounded transition-all', seat.type === 'COUPLE' ? 'w-20' : '']

  // Color classes
  if (isBooked) {
    baseClasses.push('bg-gray-600 cursor-not-allowed')
  } else {
    baseClasses.push(seatType.color)
  }

  // Interaction classes
  if (isEmpty || isDisabled || isBooked) {
    baseClasses.push('cursor-not-allowed opacity-50')
  } else {
    baseClasses.push('cursor-pointer hover:scale-105')
  }

  // Selection classes
  if (isSelected && !isBooked) {
    baseClasses.push('ring-4 ring-green-400 scale-110 z-10')
  }

  return baseClasses.filter(Boolean).join(' ')
}

const canSelectSeat = seatId => {
  const seat = props.seats[seatId]
  if (!seat) return false

  // Can't select empty, disabled or booked seats
  if (seat.type === 'EMPTY' || seat.type === 'DISABLED') return false
  if (props.mode === 'booking' && seat.status === 'BOOKED') return false

  // Check max seats limit
  if (props.maxSeatsSelect && !props.selectedSeats.has(seatId)) {
    return props.selectedSeats.size < props.maxSeatsSelect
  }

  return true
}

const handleSeatClick = (row, col, event) => {
  const seatId = `${row}-${col}`

  if (!canSelectSeat(seatId) && !props.selectedSeats.has(seatId)) {
    return
  }

  const newSelected = new Set(props.selectedSeats)

  // Admin mode: support multi-select with Ctrl/Shift
  if (props.mode === 'admin' && props.enableMultiSelect) {
    if (event.ctrlKey || event.metaKey) {
      if (newSelected.has(seatId)) {
        newSelected.delete(seatId)
      } else {
        newSelected.add(seatId)
      }
    } else if (event.shiftKey && newSelected.size > 0) {
      const lastSelected = Array.from(newSelected).pop()
      const [lastRow, lastCol] = lastSelected.split('-').map(Number)

      const minRow = Math.min(lastRow, row)
      const maxRow = Math.max(lastRow, row)
      const minCol = Math.min(lastCol, col)
      const maxCol = Math.max(lastCol, col)

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const id = `${r}-${c}`
          if (canSelectSeat(id)) {
            newSelected.add(id)
          }
        }
      }
    } else {
      newSelected.clear()
      newSelected.add(seatId)
    }
  }
  // Booking mode: simple toggle
  else {
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId)
    } else {
      if (props.maxSeatsSelect && newSelected.size >= props.maxSeatsSelect) {
        // Remove first selected seat if limit reached
        const firstSeat = Array.from(newSelected)[0]
        newSelected.delete(firstSeat)
      }
      newSelected.add(seatId)
    }
  }

  emit('update:selectedSeats', newSelected)
  emit('seatClick', { seatId, seat: getSeat(row, col), selected: newSelected.has(seatId) })
}

const handleMouseDown = (row, col) => {
  if (props.mode === 'admin' && props.selectionMode === 'drag') {
    const seatId = `${row}-${col}`
    if (canSelectSeat(seatId)) {
      isSelecting.value = true
      selectionStart.value = seatId
      emit('update:selectedSeats', new Set([seatId]))
    }
  }
}

const handleMouseEnter = (row, col) => {
  if (isSelecting.value && selectionStart.value && props.mode === 'admin') {
    const [startRow, startCol] = selectionStart.value.split('-').map(Number)

    const minRow = Math.min(startRow, row)
    const maxRow = Math.max(startRow, row)
    const minCol = Math.min(startCol, col)
    const maxCol = Math.max(startCol, col)

    const newSelected = new Set()
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const id = `${r}-${c}`
        if (canSelectSeat(id)) {
          newSelected.add(id)
        }
      }
    }
    emit('update:selectedSeats', newSelected)
  }
}

const handleMouseUp = () => {
  isSelecting.value = false
}
</script>

<style scoped>
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
