export default defineNuxtPlugin(() => {
  const connections = new Map<string, WebSocket>()
  const runtimeConfig = useRuntimeConfig()
  const createConnection = (showtimeId: string) => {
    // Close existing connection if any
    const existing = connections.get(showtimeId)
    if (existing) {
      existing.close()
    }

    // Create new WebSocket connection
    const wsUrl = `${runtimeConfig.public.baseSocketUrl}/socket/seat?showtimeId=${showtimeId}`
    console.log('🔌 Connecting to WebSocket:', wsUrl)

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('✅ WebSocket connected successfully for showtime:', showtimeId)
    }

    ws.onerror = error => {
      console.error('❌ WebSocket error for showtime:', showtimeId, error)
    }

    ws.onclose = event => {
      console.log('🔌 WebSocket closed for showtime:', showtimeId, 'Code:', event.code, 'Reason:', event.reason)
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
