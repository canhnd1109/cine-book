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

  /**
   * Connect to WebSocket for a specific showtime
   */
  const connect = (showtimeId: string) => {
    console.log('🔌 Attempting to connect to showtime:', showtimeId)

    if (currentShowtime.value === showtimeId) {
      console.log('⚠️ Already connected to this showtime')
      return // Already connected to this showtime
    }

    // Close previous connection if any
    if (currentShowtime.value) {
      console.log('🔄 Closing previous connection:', currentShowtime.value)
      disconnect()
    }

    currentShowtime.value = showtimeId
    console.log('🚀 Creating WebSocket connection...')
    const ws = socketManager.createConnection(showtimeId)

    // Handle incoming messages
    ws.onmessage = (event: MessageEvent) => {
      console.log('🚀 ~ connect ~ event:', event)
      console.group('📨 WebSocket Message Received')
      console.log('Raw data:', event.data)
      console.log('Data type:', typeof event.data)
      console.log('Time:', new Date().toLocaleTimeString())

      try {
        const message: SocketMessage = JSON.parse(event.data)
        console.log('✅ Parsed successfully:')
        console.table(message)
        console.log('Message type:', message.type)
        console.log('Message data:', message.data)

        if (message.type === 'SEAT_SELECTED') {
          console.log('💺 Processing SEAT_SELECTED event')
          console.log('Seat ID:', message.data.seatId)
          console.log('Selected:', message.data.selected)
          console.log('Showtime:', message.data.showtimeId)
          console.log('Handlers count:', messageHandlers.value.size)

          // Notify all registered handlers
          messageHandlers.value.forEach(handler => {
            console.log('🔔 Calling handler...')
            handler(message.data)
          })
        } else {
          console.warn('⚠️ Unknown message type:', message.type)
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error)
        console.error('Failed data:', event.data)
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

    console.group('📤 Sending Seat Selection')
    console.log('Showtime ID:', showtimeId)
    console.log('Seat ID:', seatId)
    console.log('Selected:', selected)
    console.log('WebSocket state:', ws?.readyState)
    console.log('Connection exists:', !!ws)

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
      console.log('✅ Message prepared:')
      console.table(message.data)
      console.log('JSON string:', jsonMessage)
      console.log('Message length:', jsonMessage.length, 'bytes')
      console.log('Sending at:', new Date().toLocaleTimeString())

      ws.send(jsonMessage)
      console.log('✅ Message sent successfully!')
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
