export interface DateItem {
  date: Date
  formatted: string
  apiFormat: string
  isToday: boolean
}

export const generateDateRange = (daysCount: number = 9) => {
  const dates: DateItem[] = []
  const today = new Date()

  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const year = currentDate.getFullYear()

    dates.push({
      date: currentDate,
      formatted: `${day}-${month}-${year}`,
      apiFormat: `${year}-${month}-${day}`,
      isToday: i === 0
    })
  }

  return dates
}
