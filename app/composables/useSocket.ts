interface SeatSelection {
  showtimeId: string
  seatId: string
  selected: boolean
}

interface SocketManager {
  createConnection: (showtimeId: string) => WebSocket
  closeConnection: (showtimeId: string) => void
  getConnection: (showtimeId: string) => WebSocket | undefined
}

export const useSocket = () => {
  const { $socket } = useNuxtApp()
  const socketManager = $socket as unknown as SocketManager

  const currentShowtime = ref<string>('')
  const messageHandlers = ref<Set<(data: SeatSelection) => void>>(new Set())
  const bulkUpdateHandlers = ref<Set<(seatIds: string[]) => void>>(new Set())

  const connect = (showtimeId: string) => {
    if (currentShowtime.value === showtimeId) {
      return
    }

    if (currentShowtime.value) {
      disconnect()
    }

    currentShowtime.value = showtimeId
    const ws = socketManager.createConnection(showtimeId)

    ws.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && !event.data.trim().startsWith('{') && !event.data.trim().startsWith('[')) {
        return
      }

      try {
        const parsed = JSON.parse(event.data)

        if (Array.isArray(parsed) && (parsed.length === 0 || typeof parsed[0] === 'string')) {
          bulkUpdateHandlers.value.forEach(handler => {
            handler(parsed as string[])
          })
          return
        }

        const dataArray: SeatSelection[] = Array.isArray(parsed) ? parsed : [parsed]
        dataArray.forEach(data => {
          messageHandlers.value.forEach(handler => {
            handler(data)
          })
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const disconnect = () => {
    if (currentShowtime.value) {
      socketManager.closeConnection(currentShowtime.value)
      currentShowtime.value = ''
      messageHandlers.value.clear()
    }
  }

  const joinShowtimeRoom = (showtimeId: string) => {
    connect(showtimeId)
  }

  const leaveShowtimeRoom = (showtimeId: string) => {
    if (currentShowtime.value === showtimeId) {
      disconnect()
    }
  }

  const selectSeat = (showtimeId: string, seatId: string, selected: boolean) => {
    const ws = socketManager.getConnection(showtimeId)

    if (ws && ws.readyState === WebSocket.OPEN) {
      const data: SeatSelection = {
        showtimeId,
        seatId,
        selected
      }
      const jsonMessage = JSON.stringify(data)

      ws.send(jsonMessage)
    } else {
      console.error(ws?.readyState)
    }
  }

  const onSeatSelected = (callback: (data: SeatSelection) => void) => {
    messageHandlers.value.add(callback)
  }

  const offSeatSelected = (callback?: (data: SeatSelection) => void) => {
    if (callback) {
      messageHandlers.value.delete(callback)
    } else {
      messageHandlers.value.clear()
    }
  }

  const onBulkSeatsUpdate = (callback: (seatIds: string[]) => void) => {
    bulkUpdateHandlers.value.add(callback)
  }

  const offBulkSeatsUpdate = (callback?: (seatIds: string[]) => void) => {
    if (callback) {
      bulkUpdateHandlers.value.delete(callback)
    } else {
      bulkUpdateHandlers.value.clear()
    }
  }

  const isConnected = computed(() => {
    if (!currentShowtime.value) return false
    const ws = socketManager.getConnection(currentShowtime.value)
    return ws && ws.readyState === WebSocket.OPEN
  })

  return {
    isConnected,
    connect,
    disconnect,
    joinShowtimeRoom,
    leaveShowtimeRoom,
    selectSeat,
    onSeatSelected,
    offSeatSelected,
    onBulkSeatsUpdate,
    offBulkSeatsUpdate
  }
}
