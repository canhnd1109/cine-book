export interface IStatisticsSummary {
  totalBookings: number
  totalRevenue: number
  totalCinemas: number
  totalRooms: number
  totalMovies: number
  totalGenres: number
}

export interface IRevenueReportParams {
  groupType: number // 1-Theo ngày, 2-Theo tuần, 3-Theo tháng, 4-Theo năm
  fromDate: string
  toDate: string
}

export interface IRevenueReport {
  time: string
  value: number
}
