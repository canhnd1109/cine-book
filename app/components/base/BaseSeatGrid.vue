<script setup lang="ts">
import type { TypeSeat, TypeSeatStatus } from '~/types/cinema.type'

const { t } = useI18n()

interface Seat {
  row: number
  col: number
  type: TypeSeat
  price: number
  status?: TypeSeatStatus
  rowLabel?: string
  colLabel?: number
}

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
    type: Object as PropType<Record<string, Seat>>,
    default: () => ({})
  },
  selectedSeats: {
    type: Set as PropType<Set<string>>,
    default: () => new Set()
  },
  mode: {
    type: String as PropType<'admin' | 'booking'>,
    default: 'admin',
    validator: (value: string) => ['admin', 'booking'].includes(value)
  },
  selectionMode: {
    type: String as PropType<'click' | 'drag'>,
    default: 'click'
  },
  enableMultiSelect: {
    type: Boolean,
    default: true
  },
  maxSeatsSelect: {
    type: Number,
    default: null
  }
})

const emit = defineEmits<{
  'update:selectedSeats': [seats: Set<string>]
  seatClick: [data: { seatId: string; seat: Seat | undefined; selected: boolean }]
  updateSeatType: [data: { seatIds: string[]; type: string; price: number }]
}>()

const seatTypes = {
  NORMAL: { label: t('normal'), color: 'bg-blue-500 text-blue-500' },
  VIP: { label: t('vip'), color: 'bg-yellow-500 text-yellow-500' },
  COUPLE: { label: t('couple'), color: 'bg-pink-500 text-pink-500' },
  DISABLED: { label: t('disabled'), color: 'bg-gray-400 text-gray-400' },
  BOOKED: { label: 'Ghế đã đặt', color: 'bg-red-600 text-red-600' },
  SELECTED: { label: 'Ghế bạn chọn', color: 'bg-orange-500 text-orange-500' }
}

// State
const isSelecting = ref(false)
const selectionStart = ref<string | null>(null)

// Methods
const getSeat = (row: number, col: number): Seat | undefined => {
  const seatId = `${row}-${col}`
  return props.seats[seatId]
}

const getSeatClass = (row: number, col: number): string => {
  const seatId = `${row}-${col}`
  const seat = getSeat(row, col)
  const isSelected = props.selectedSeats.has(seatId)

  if (!seat) return ''

  const seatType = seatTypes[seat.type]
  const isDisabled = seat.type === 'DISABLED'
  const isBooked = props.mode === 'booking' && seat.status === 'BOOKED'

  const baseClasses = ['relative w-10 h-10 m-0.5 rounded transition-all']

  // Handle selected seats in booking mode - override with orange background
  if (isSelected && props.mode === 'booking' && !isBooked) {
    baseClasses.push('bg-orange-500 text-white scale-110 z-10')
  } else if (isBooked) {
    baseClasses.push('bg-red-600 cursor-not-allowed')
  } else {
    baseClasses.push(seatType.color)
  }

  if (isDisabled || isBooked) {
    baseClasses.push('cursor-not-allowed opacity-50')
  } else {
    baseClasses.push('cursor-pointer hover:scale-105')
  }

  // For admin mode, use ring instead of background change
  if (isSelected && props.mode === 'admin' && !isBooked) {
    baseClasses.push('ring-4 ring-green-400 scale-110 z-10')
  }

  return baseClasses.filter(Boolean).join(' ')
}

const canSelectSeat = (seatId: string): boolean => {
  const seat = props.seats[seatId]
  if (!seat) return false

  if (seat.type === 'DISABLED') return false
  if (props.mode === 'booking' && seat.status === 'BOOKED') return false

  if (props.maxSeatsSelect && !props.selectedSeats.has(seatId)) {
    return props.selectedSeats.size < props.maxSeatsSelect
  }

  return true
}

const handleSeatClick = (row: number, col: number, event: MouseEvent) => {
  const seatId = `${row}-${col}`

  if (!canSelectSeat(seatId) && !props.selectedSeats.has(seatId)) {
    return
  }

  const newSelected = new Set(props.selectedSeats)

  if (props.mode === 'admin' && props.enableMultiSelect) {
    if (event.ctrlKey || event.metaKey) {
      if (newSelected.has(seatId)) {
        newSelected.delete(seatId)
      } else {
        newSelected.add(seatId)
      }
    } else if (event.shiftKey && newSelected.size > 0) {
      const lastSelected = Array.from(newSelected).pop()
      if (lastSelected) {
        const [lastRowStr, lastColStr] = lastSelected.split('-')
        const lastRow = Number(lastRowStr)
        const lastCol = Number(lastColStr)

        if (Number.isNaN(lastRow) || Number.isNaN(lastCol)) return

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
      }
    } else {
      newSelected.clear()
      newSelected.add(seatId)
    }
  } else {
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId)
    } else {
      if (props.maxSeatsSelect && newSelected.size >= props.maxSeatsSelect) {
        const firstSeat = Array.from(newSelected)[0]
        if (typeof firstSeat === 'string') {
          newSelected.delete(firstSeat)
        }
      }
      newSelected.add(seatId)
    }
  }

  emit('update:selectedSeats', newSelected)
  emit('seatClick', { seatId, seat: getSeat(row, col), selected: newSelected.has(seatId) })
}

const handleMouseDown = (row: number, col: number) => {
  if (props.mode === 'admin' && props.selectionMode === 'drag') {
    const seatId = `${row}-${col}`
    if (canSelectSeat(seatId)) {
      isSelecting.value = true
      selectionStart.value = seatId
      emit('update:selectedSeats', new Set([seatId]))
    }
  }
}

const handleMouseEnter = (row: number, col: number) => {
  if (isSelecting.value && selectionStart.value && props.mode === 'admin') {
    const [startRowStr, startColStr] = selectionStart.value.split('-')
    const startRow = Number(startRowStr)
    const startCol = Number(startColStr)

    if (Number.isNaN(startRow) || Number.isNaN(startCol) || typeof row !== 'number' || typeof col !== 'number') {
      return
    }

    const minRow = Math.min(startRow, row)
    const maxRow = Math.max(startRow, row)
    const minCol = Math.min(startCol, col)
    const maxCol = Math.max(startCol, col)

    const newSelected = new Set<string>()
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
<template>
  <div>
    <!-- Screen -->
    <div class="mb-6 flex flex-col items-center">
      <UBadge variant="subtle" class="mt-2">{{ t('screen') }}</UBadge>
    </div>

    <!-- Seat Grid with Transition -->
    <div class="flex justify-center select-none mb-6" @mouseup="handleMouseUp">
      <TransitionGroup name="seat-grid" tag="div" class="inline-block" :css="true">
        <div v-for="row in rows" :key="`row-${row}`" class="flex items-center space-x-2 seat-row">
          <UBadge variant="subtle" class="w-8 text-center font-bold flex justify-center items-center">
            {{ String.fromCharCode(64 + row) }}
          </UBadge>

          <TransitionGroup name="seat" tag="div" class="flex" :css="true">
            <UIcon
              v-for="col in cols"
              :key="`seat-${row}-${col}`"
              name="i-lucide-armchair"
              class="size-5"
              :class="getSeatClass(row - 1, col - 1)"
              @click="handleSeatClick(row - 1, col - 1, $event)"
              @mousedown="handleMouseDown(row - 1, col - 1)"
              @mouseenter="handleMouseEnter(row - 1, col - 1)"
            >
              <div
                v-if="getSeat(row - 1, col - 1)?.type !== 'DISABLED' && mode === 'admin'"
                class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
              >
                {{ String.fromCharCode(64 + row) }}{{ col }}
              </div>

              <!-- Status indicator for booked seats -->
              <div
                v-if="mode === 'booking' && getSeat(row - 1, col - 1)?.status === 'BOOKED'"
                class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
            /></UIcon>
          </TransitionGroup>
        </div>
      </TransitionGroup>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 justify-center">
      <div v-for="(type, key) in seatTypes" :key="key" class="flex items-center gap-2">
        <div :class="['w-6 h-6 rounded', type.color]" />
        <span class="text-sm">{{ type.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Row Animation */
.seat-row {
  transform-origin: left center;
}

.seat-grid-enter-active,
.seat-grid-leave-active {
  transition: all 0.3s ease;
}

.seat-grid-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.seat-grid-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.seat-grid-move {
  transition: transform 0.3s ease;
}

/* Individual Seat Animation */
.seat-enter-active {
  transition: all 0.2s ease;
  transition-delay: calc(var(--seat-index, 0) * 0.02s);
}

.seat-leave-active {
  transition: all 0.2s ease;
}

.seat-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-5deg);
}

.seat-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(5deg);
}

.seat-move {
  transition: transform 0.2s ease;
}

/* Smooth layout changes */
.inline-block {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
