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
      // Check if it's a text message (not JSON)
      if (typeof event.data === 'string' && !event.data.trim().startsWith('{')) {
        return
      }

      try {
        const data: SeatSelection = JSON.parse(event.data)
        console.log('📨 Received seat update:', data)

        // Notify all registered handlers
        messageHandlers.value.forEach(handler => {
          handler(data)
        })
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error)
        console.error('Failed data:', event.data)
      }
    }
  }

  /**
   * Disconnect from current showtime WebSocket
   */
  const disconnect = () => {
    if (currentShowtime.value) {
      socketManager.closeConnection(currentShowtime.value)
      currentShowtime.value = ''
      messageHandlers.value.clear()
    }
  }

  /**
   * Join room theo showtimeId (same as connect for WebSocket)
   */
  const joinShowtimeRoom = (showtimeId: string) => {
    connect(showtimeId)
  }

  /**
   * Leave room theo showtimeId (same as disconnect)
   */
  const leaveShowtimeRoom = (showtimeId: string) => {
    if (currentShowtime.value === showtimeId) {
      disconnect()
    }
  }

  /**
   * Send seat selection message
   */
  const selectSeat = (showtimeId: string, seatId: string, selected: boolean) => {
    const ws = socketManager.getConnection(showtimeId)

    if (ws && ws.readyState === WebSocket.OPEN) {
      const data: SeatSelection = {
        showtimeId,
        seatId,
        selected
      }
      const jsonMessage = JSON.stringify(data)
      console.log('📤 Sending:', jsonMessage)

      ws.send(jsonMessage)
    } else {
      console.error('❌ WebSocket not ready, state:', ws?.readyState)
    }
  }

  /**
   * Listen for seat selection events
   */
  const onSeatSelected = (callback: (data: SeatSelection) => void) => {
    messageHandlers.value.add(callback)
  }

  /**
   * Remove seat selection listener
   */
  const offSeatSelected = (callback?: (data: SeatSelection) => void) => {
    if (callback) {
      messageHandlers.value.delete(callback)
    } else {
      messageHandlers.value.clear()
    }
  }

  /**
   * Check connection status
   */
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
    offSeatSelected
  }
}
