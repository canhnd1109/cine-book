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
      console.log('📥 Raw message from server:', event.data)

      // Check if it's a text message (not JSON)
      if (typeof event.data === 'string' && !event.data.trim().startsWith('{') && !event.data.trim().startsWith('[')) {
        console.log('ℹ️ Plain text message (ignored):', event.data)
        return
      }

      try {
        const parsed = JSON.parse(event.data)
        console.log('📦 Parsed message:', parsed)

        // Case 1: Array of seat IDs (bulk update on connect/disconnect)
        // Check if it's an array AND either empty OR first element is string (UUID)
        // Empty array means no seats locked (user disconnected)
        if (Array.isArray(parsed) && (parsed.length === 0 || typeof parsed[0] === 'string')) {
          console.log('🔄 Bulk update:', parsed)
          bulkUpdateHandlers.value.forEach(handler => {
            handler(parsed as string[])
          })
          return
        }

        // Case 2: Single seat selection or array of seat selection objects
        const dataArray: SeatSelection[] = Array.isArray(parsed) ? parsed : [parsed]
        console.log('💺 Seat selections:', dataArray)

        // Notify all registered handlers for each seat selection
        dataArray.forEach(data => {
          messageHandlers.value.forEach(handler => {
            handler(data)
          })
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
   * Listen for bulk seat updates (on connect/disconnect)
   */
  const onBulkSeatsUpdate = (callback: (seatIds: string[]) => void) => {
    bulkUpdateHandlers.value.add(callback)
  }

  /**
   * Remove bulk seat update listener
   */
  const offBulkSeatsUpdate = (callback?: (seatIds: string[]) => void) => {
    if (callback) {
      bulkUpdateHandlers.value.delete(callback)
    } else {
      bulkUpdateHandlers.value.clear()
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
    offSeatSelected,
    onBulkSeatsUpdate,
    offBulkSeatsUpdate
  }
}
