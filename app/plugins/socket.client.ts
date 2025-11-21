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
    const ws = new WebSocket(wsUrl)

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
