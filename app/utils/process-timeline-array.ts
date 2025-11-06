export interface BookingItem {
  id: string
  date: string
  timeline: string
}

export interface TimeSlot {
  time: string
  id: string
}

export interface CalendarDay {
  weekday: string
  date: string
  fullDate: string
  isToday: boolean
  timeSlots: TimeSlot[]
}

function getTodayDateString(): string {
  const today = new Date()
  return `${today.getFullYear()}:${String(today.getMonth() + 1).padStart(2, '0')}:${String(today.getDate()).padStart(2, '0')}`
}

function formatDateWithWeekday(dateString: string, todayString: string): Omit<CalendarDay, 'timeSlots'> {
  const parts = dateString.split(':')
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateString}. Expected format: YYYY:MM:DD`)
  }

  const [year, month, day] = parts.map(Number)

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error(`Invalid date values: year=${year}, month=${month}, day=${day}`)
  }

  const date = new Date(year as number, (month as number) - 1, day)

  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

  const isToday = dateString === todayString
  const weekday = isToday ? 'Hôm nay' : (weekdays[date.getDay()] as string)

  const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`

  return {
    weekday,
    date: formattedDate,
    fullDate: dateString,
    isToday
  }
}

function getDatesFromData(bookingArray: BookingItem[]): Omit<CalendarDay, 'timeSlots'>[] {
  const todayString = getTodayDateString()
  const uniqueDates = Array.from(new Set(bookingArray.map(item => item.date))).sort()

  return uniqueDates.map(dateString => formatDateWithWeekday(dateString, todayString))
}

export default function processTimelineArray(bookingArray: BookingItem[], referenceDate?: string): CalendarDay[] {
  const calendarDates = getDatesFromData(bookingArray)

  const timelinesByDate: { [key: string]: { [time: string]: string } } = {}

  bookingArray.forEach(item => {
    const dateKey = item.date
    const timeKey = item.timeline.split('-')[0]

    if (!timelinesByDate[dateKey]) {
      timelinesByDate[dateKey] = {}
    }
    timelinesByDate[dateKey][timeKey as string] = item.id
  })

  const calendarDays: CalendarDay[] = calendarDates.map(dayInfo => {
    const timeSlots: TimeSlot[] = []

    const timesForDay = timelinesByDate[dayInfo.fullDate] || {}
    const sortedTimes = Object.keys(timesForDay).sort()

    sortedTimes.forEach(time => {
      timeSlots.push({
        time,
        id: timesForDay[time] as string
      })
    })

    return {
      ...dayInfo,
      timeSlots
    }
  })

  return calendarDays
}
