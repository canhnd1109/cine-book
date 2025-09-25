import BaseService from '~/plugins/base'

export function useBookingApi() {
  const bookingService = new BaseService('/bookings')

  const createBooking = async (data: {
    scheduleId: string
    seats: string[]
    customerInfo: {
      name: string
      email: string
      phone: string
    }
  }) => {
    return bookingService.postWithResponse('', data)
  }

  const getBookings = async (params?: {
    page?: number
    limit?: number
    status?: string
  }) => {
    return bookingService.get('', params)
  }

  const getBooking = async (id: string) => {
    return bookingService.get(`/${id}`)
  }

  const cancelBooking = async (id: string) => {
    return bookingService.put(`/${id}/cancel`)
  }

  const confirmPayment = async (id: string, paymentData: Record<string, unknown>) => {
    return bookingService.postWithResponse(`/${id}/payment`, paymentData)
  }

  return {
    createBooking,
    getBookings,
    getBooking,
    cancelBooking,
    confirmPayment
  }
}
