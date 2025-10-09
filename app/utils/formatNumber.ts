export const formatNumber = (value: number | string): string => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN').format(Number(value))
}
