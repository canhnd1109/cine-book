import BaseService from '~/plugins/base'

export function usePaymentApi() {
  const paymentService = new BaseService('/payments')

  const createPayment = async (data: {
    bookingId: string
    amount: number
    method: string
  }) => {
    return paymentService.postWithResponse('', data)
  }

  const getPaymentMethods = async () => {
    return paymentService.get('/methods')
  }

  const verifyPayment = async (paymentId: string) => {
    return paymentService.get(`/${paymentId}/verify`)
  }

  return {
    createPayment,
    getPaymentMethods,
    verifyPayment
  }
}
