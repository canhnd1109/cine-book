export function useFormatPrice(amount: number | string): string {
  if (amount == null || amount === '') return '0 ₫'

  const number = Number(amount)
  if (isNaN(number)) return '0 ₫'

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}
