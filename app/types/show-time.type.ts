export interface IShowtime {
  cinemaId: string
  cinemaName: string
  province: string
  district: string
  commune: string
  detailAddress: string
  showtimeDetails: IShowtimeDetails[]
}

export interface IShowtimeDetails {
  id: string
  date: string
  startTime: string
  endTime: string
  roomResponse: IShowtimeRoomResponse
}

export interface IShowtimeRoomResponse {
  roomId: string
  name: string
  totalRow: number
  totalCol: number
  seats: {
    seatId: string
    seatName: string
    seatType: string
    price: number
    rowIdx: number
    colIdx: number
    status: string
    booked: boolean
  }[]
}

export interface IShowtimeTable {
  cinemaId: string
  cinemaName: string
  province: string
  district: string
  commune: string
  detailAddress: string
  id: string
  date: string
  startTime: string
  endTime: string
  roomId: string
  name: string
  totalRow: number
  totalCol: number
}
