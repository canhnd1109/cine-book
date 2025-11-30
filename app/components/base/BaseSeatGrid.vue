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
  seatId?: string
}

interface Props {
  rows: number
  cols: number
  seats?: Record<string, Seat>
  selectedSeats?: Set<string>
  mode?: 'admin' | 'booking'
  selectionMode?: 'click' | 'drag'
  enableMultiSelect?: boolean
  maxSeatsSelect?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  seats: () => ({}),
  selectedSeats: () => new Set(),
  mode: 'admin',
  selectionMode: 'click',
  enableMultiSelect: true,
  maxSeatsSelect: 8
})

const emit = defineEmits<{
  'update:selectedSeats': [seats: Set<string>]
  seatClick: [data: { seatId: string; seat: Seat | undefined; selected: boolean; backendSeatId?: string }]
  updateSeatType: [data: { seatIds: string[]; type: string; price: number }]
}>()

const seatTypes = computed(() => ({
  NORMAL: { label: t('normal'), color: 'bg-blue-500 text-blue-500' },
  VIP: { label: t('vip'), color: 'bg-yellow-500 text-yellow-500' },
  COUPLE: { label: t('couple'), color: 'bg-pink-500 text-pink-500' },
  DISABLED: { label: t('disabled'), color: 'bg-gray-400 text-gray-400' },
  ...(props.mode === 'booking'
    ? {
        LOCKED: { label: t('locked-by-others') || 'Người khác đang chọn', color: '', customColor: '#00e080' },
        BOOKED: { label: t('booked-seats'), color: 'bg-red-600 text-red-600' },
        SELECTED: { label: t('your-selected-seats'), color: 'bg-orange-500 text-orange-500' }
      }
    : {})
}))

const isSelecting = ref(false)
const selectionStart = ref<string | null>(null)

const getSeat = (row: number, col: number): Seat | undefined => {
  const seatId = `${row}-${col}`
  return props.seats[seatId]
}

const getSeatClass = (row: number, col: number): string => {
  const seatId = `${row}-${col}`
  const seat = getSeat(row, col)
  const isSelected = props.selectedSeats?.has(seatId) ?? false

  if (!seat) return ''

  const seatType = seatTypes.value[seat.type as keyof typeof seatTypes.value]
  const isDisabled = seat.type === 'DISABLED'
  const isBooked = props.mode === 'booking' && seat.status === 'BOOKED'
  const isLockedByOthers = props.mode === 'booking' && seat.status === 'LOCKED'

  // Fallback to NORMAL if seatType is not found
  const seatColor = seatType?.color || seatTypes.value.NORMAL.color

  const classes = ['relative w-10 h-10 m-0.5 rounded transition-all']

  if (props.mode === 'admin') {
    if (isSelected) {
      classes.push('bg-orange-500 text-orange-500 scale-110 z-10')
    } else {
      classes.push(seatColor)
    }

    classes.push('cursor-pointer hover:scale-105')
  } else {
    // Người dùng đang chọn (ưu tiên cao nhất)
    if (isSelected && !isBooked && !isDisabled && !isLockedByOthers) {
      classes.push('bg-orange-500 text-white scale-110 z-10')
    }
    // Người khác đang chọn (màu #00e080)
    else if (isLockedByOthers && !isBooked) {
      classes.push('scale-105 z-5')
      classes.push('cursor-not-allowed')
      // Sử dụng inline style cho màu custom
    }
    // Ghế đã được đặt
    else if (isBooked) {
      classes.push('bg-red-600 opacity-50')
    }
    // Ghế disabled
    else if (isDisabled) {
      classes.push(seatColor)
      classes.push('opacity-50')
    }
    // Ghế bình thường
    else {
      classes.push(seatColor)
    }

    if (isBooked || isDisabled || isLockedByOthers) {
      classes.push('cursor-not-allowed')
    } else {
      classes.push('cursor-pointer hover:scale-105')
    }
  }

  return classes.join(' ')
}

const canSelectSeat = (seatId: string): boolean => {
  const seat = props.seats?.[seatId]
  if (!seat) return false

  if (props.mode === 'admin') {
    return true
  }

  if (seat.type === 'DISABLED') return false
  if (seat.status === 'BOOKED') return false
  if (seat.status === 'LOCKED') return false // Không cho chọn ghế người khác đang chọn

  if (props.maxSeatsSelect && !(props.selectedSeats?.has(seatId) ?? false)) {
    return (props.selectedSeats?.size ?? 0) < props.maxSeatsSelect
  }

  return true
}

const handleSeatClick = (row: number, col: number, event: MouseEvent) => {
  const seatId = `${row}-${col}`
  const seat = getSeat(row, col)
  const backendSeatId = seat?.seatId

  if (!canSelectSeat(seatId) && !(props.selectedSeats?.has(seatId) ?? false)) {
    return
  }

  const newSelected = new Set(props.selectedSeats ?? new Set())

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
  emit('seatClick', {
    seatId,
    seat,
    selected: newSelected.has(seatId),
    backendSeatId
  })
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
  if (!isSelecting.value || !selectionStart.value || props.mode !== 'admin') {
    return
  }

  const [startRowStr, startColStr] = selectionStart.value.split('-')
  const startRow = Number(startRowStr)
  const startCol = Number(startColStr)

  if (Number.isNaN(startRow) || Number.isNaN(startCol)) {
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

const handleMouseUp = () => {
  isSelecting.value = false
}
</script>
<template>
  <div>
    <div class="mb-6 flex flex-col items-center">
      <UBadge variant="subtle" class="mt-2">{{ t('screen') }}</UBadge>
    </div>

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
              :style="
                mode === 'booking' && getSeat(row - 1, col - 1)?.status === 'LOCKED'
                  ? { color: '#00e080', backgroundColor: '#00e080' }
                  : {}
              "
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

              <div
                v-if="mode === 'booking' && getSeat(row - 1, col - 1)?.status === 'BOOKED'"
                class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
            /></UIcon>
          </TransitionGroup>
        </div>
      </TransitionGroup>
    </div>

    <div class="flex flex-wrap gap-4 justify-center">
      <div v-for="(type, key) in seatTypes" :key="key" class="flex items-center gap-2">
        <UIcon
          name="i-lucide-armchair"
          :class="['w-6 h-6 rounded', type?.color]"
          :style="
            type && 'customColor' in type && type.customColor
              ? { color: type.customColor, backgroundColor: type.customColor }
              : {}
          "
        />
        <span class="text-sm">{{ type?.label }}</span>
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
