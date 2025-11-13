interface SeatSelection {
  showtimeId: string
  seatId: string
  selected: boolean
}

interface SocketMessage {
  type: 'SELECT_SEAT' | 'SEAT_SELECTED'
  data: SeatSelection
}

export const useSocket = () => {
  const { $socket } = useNuxtApp()
  const socketManager = $socket as any

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
        const parsed = JSON.parse(event.data)

        // Check if message has type field (new format)
        if (parsed.type) {
          const message: SocketMessage = parsed
          console.log('🚀 ~ connect ~ message:', message)

          if (message.type === 'SEAT_SELECTED') {
            // Notify all registered handlers
            messageHandlers.value.forEach(handler => {
              handler(message.data)
            })
          } else {
            console.warn('⚠️ Unknown message type:', message.type)
          }
        } else if (parsed.showtimeId && parsed.seatId && typeof parsed.selected === 'boolean') {
          messageHandlers.value.forEach(handler => {
            handler(parsed as SeatSelection)
          })
        } else {
          console.warn('⚠️ Unknown message format:', parsed)
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error)
        console.error('Failed data:', event.data)
        console.error('Is it JSON?', event.data.toString().substring(0, 100))
      }
      console.groupEnd()
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
      const message: SocketMessage = {
        type: 'SELECT_SEAT',
        data: {
          showtimeId,
          seatId,
          selected
        }
      }
      const jsonMessage = JSON.stringify(message.data)

      ws.send(jsonMessage)
    } else {
      console.error('❌ Cannot send - WebSocket not ready')
      console.error('ReadyState:', ws?.readyState, '(0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)')
      console.error('WebSocket URL:', ws?.url)
    }
    console.groupEnd()
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
