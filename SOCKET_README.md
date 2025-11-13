# Socket.IO Real-time Seat Selection

## Cấu trúc

### 1. Plugin Socket (`app/plugins/socket.client.ts`)

- Khởi tạo kết nối Socket.IO với server `ws://localhost:8080`
- Tự động kết nối khi client load
- Provide `$socket` instance cho toàn bộ app

### 2. Composable (`app/composables/useSocket.ts`)

Wrapper giúp sử dụng socket dễ dàng hơn:

#### Methods:

- **`joinShowtimeRoom(showtimeId: string)`**: Join vào room theo showtimeId
- **`leaveShowtimeRoom(showtimeId: string)`**: Rời khỏi room
- **`selectSeat(showtimeId: string, seatId: string, selected: boolean)`**: Emit sự kiện chọn/bỏ ghế
- **`onSeatSelected(callback)`**: Lắng nghe sự kiện người khác chọn ghế
- **`offSeatSelected(callback?)`**: Hủy lắng nghe

#### Computed:

- **`isConnected`**: Trạng thái kết nối socket

## Cách sử dụng

### Trong component (đã implement trong `pages/movie/[id].vue`):

```typescript
// 1. Khởi tạo socket composable
const { joinShowtimeRoom, leaveShowtimeRoom, selectSeat, onSeatSelected, offSeatSelected } = useSocket()

// 2. Tạo state để lưu ghế đang bị lock bởi người khác
const lockedSeats = ref<Set<string>>(new Set())

// 3. Lắng nghe sự kiện người khác chọn ghế (onMounted)
onMounted(() => {
  onSeatSelected(data => {
    if (data.selected) {
      lockedSeats.value.add(data.seatId)
    } else {
      lockedSeats.value.delete(data.seatId)
    }
  })
})

// 4. Cleanup khi unmount
onUnmounted(() => {
  if (showTime.value?.id) {
    leaveShowtimeRoom(showTime.value.id)
  }
  offSeatSelected()
})

// 5. Join/Leave room khi thay đổi showtime
watch(showTime, (newShowTime, oldShowTime) => {
  // Leave old room
  if (oldShowTime?.id) {
    leaveShowtimeRoom(oldShowTime.id)
  }

  // Join new room
  if (newShowTime?.id) {
    joinShowtimeRoom(newShowTime.id)
  }
})

// 6. Emit khi user chọn ghế
watch(selectedSeats, (newSeats, oldSeats) => {
  if (!showTime.value?.id) return

  // Ghế mới được chọn
  const addedSeats = [...newSeats].filter(seat => !oldSeats.has(seat))
  addedSeats.forEach(seatKey => {
    const seat = seatsRecord.value[seatKey]
    if (seat?.seatId) {
      selectSeat(showTime.value!.id, seat.seatId, true)
    }
  })

  // Ghế bị bỏ chọn
  const removedSeats = [...oldSeats].filter(seat => !newSeats.has(seat))
  removedSeats.forEach(seatKey => {
    const seat = seatsRecord.value[seatKey]
    if (seat?.seatId) {
      selectSeat(showTime.value!.id, seat.seatId, false)
    }
  })
})

// 7. Update seat status dựa trên lockedSeats
const seatsRecord = computed(() => {
  // ...
  const isLockedByOthers = lockedSeats.value.has(seat.seatId || '')

  record[key] = {
    // ...
    status: seat.booked ? 'BOOKED' : isLockedByOthers ? 'LOCKED' : 'AVAILABLE'
  }
})
```

## Socket Events

### Client Emit:

- **`join`**: Join vào room

  ```typescript
  socket.emit('join', { showtimeId: 'abc123' })
  ```

- **`leave`**: Rời khỏi room

  ```typescript
  socket.emit('leave', { showtimeId: 'abc123' })
  ```

- **`selectSeat`**: Thông báo chọn/bỏ ghế
  ```typescript
  socket.emit('selectSeat', {
    showtimeId: 'abc123',
    seatId: 'seat1',
    selected: true // true = chọn, false = bỏ chọn
  })
  ```

### Server Emit (Client Listen):

- **`seatSelected`**: Nhận thông báo từ người khác
  ```typescript
  socket.on('seatSelected', data => {
    // data: { showtimeId, seatId, selected }
    console.log(`User selected seat ${data.seatId}`)
  })
  ```

## Luồng hoạt động

1. **User A** vào trang xem phim và chọn suất chiếu
2. Socket tự động **join** vào room theo `showtimeId`
3. **User A** click chọn ghế → emit `selectSeat` với `selected: true`
4. Server broadcast event `seatSelected` cho tất cả users khác trong room
5. **User B** nhận được event → thêm `seatId` vào `lockedSeats`
6. UI của **User B** tự động update, hiển thị ghế đó bị LOCKED
7. Khi **User A** bỏ chọn → emit `selectSeat` với `selected: false`
8. **User B** remove `seatId` khỏi `lockedSeats` → ghế trở về AVAILABLE

## Notes

- Socket chỉ chạy ở client-side (`.client.ts`)
- Auto reconnect nếu mất kết nối
- Cleanup listeners khi component unmount để tránh memory leak
- Sử dụng `Set<string>` để quản lý ghế locked hiệu quả hơn
