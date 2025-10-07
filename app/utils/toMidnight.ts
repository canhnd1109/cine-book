export function toMidnight(dateTime: string) {
  if (!dateTime) return ''
  const [date] = dateTime.split('T')
  return `${date}T00:00:00`
}
