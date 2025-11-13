export default defineNuxtPlugin(() => {
  // WebSocket connection manager
  const connections = new Map<string, WebSocket>()

  const createConnection = (showtimeId: string) => {
    // Close existing connection if any
    const existing = connections.get(showtimeId)
    if (existing) {
      console.log('🔄 Closing existing connection for showtime:', showtimeId)
      existing.close()
    }

    // Create new WebSocket connection
    const wsUrl = `ws://localhost:8080/socket/seat?showtimeId=${showtimeId}`
    console.log('🌐 Creating WebSocket connection to:', wsUrl)
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('✅ WebSocket CONNECTED for showtime:', showtimeId)
      console.log('📡 Connection details:', {
        url: wsUrl,
        readyState: ws.readyState,
        protocol: ws.protocol,
        extensions: ws.extensions
      })
    }

    ws.onclose = event => {
      console.log('❌ WebSocket DISCONNECTED for showtime:', showtimeId)
      console.log('🔌 Close event:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      })
      connections.delete(showtimeId)
    }

    ws.onerror = error => {
      console.error('❌ WebSocket ERROR for showtime:', showtimeId)
      console.error('⚠️ Error details:', error)
      console.error('🔍 WebSocket state:', {
        readyState: ws.readyState,
        url: ws.url
      })
    }

    ws.onmessage = event => {
      console.log('📨 RAW WebSocket message received:')
      console.log('├─ Data:', event.data)
      console.log('├─ Type:', event.type)
      console.log('└─ Timestamp:', new Date().toISOString())
    }

    connections.set(showtimeId, ws)
    return ws
  }

  const closeConnection = (showtimeId: string) => {
    const ws = connections.get(showtimeId)
    if (ws) {
      ws.close()
      connections.delete(showtimeId)
    }
  }

  const getConnection = (showtimeId: string) => {
    return connections.get(showtimeId)
  }

  // Provide socket utilities
  return {
    provide: {
      socket: {
        createConnection,
        closeConnection,
        getConnection,
        connections
      }
    }
  }
})
