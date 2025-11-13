interface PhoneFormatOptions {
  separator?: ' ' | '-' | '.'
  format?: '4-3-3' | '3-3-4'
}

export const formatPhoneNumber = (phone: string | number, options: PhoneFormatOptions = {}): string => {
  if (!phone) return ''

  const { separator = ' ', format = '4-3-3' } = options

  const cleaned = phone.toString().replace(/\D/g, '')

  if (cleaned.length === 10) {
    if (format === '4-3-3') {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, `$1${separator}$2${separator}$3`)
    } else if (format === '3-3-4') {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, `$1${separator}$2${separator}$3`)
    }
  }

  return phone.toString()
}
