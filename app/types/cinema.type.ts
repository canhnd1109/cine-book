import type { IFormCinema } from '~/schemas/cinema.chema'

export interface ICinemaFilter {
  keyWord: string
}

export type IFormState = Omit<IFormCinema, 'province' | 'commune'> & {
  province: string
  commune: string
}

export interface ICinema {
  id: string
  name: string
  province: string
  district: string
  commune: string
  detailAddress: string
  phone: string
  description: string
  status: string
  urlImages: string[]
}

export interface IBodyRoom {
  cinemaId: string
  name: string
  totalRow: number
  totalCol: number
  seats: {
    seatName: string
    price: number
    rowIdx: number
    colIdx: number
  }[]
}

export interface IRoom {
  name: string
  roomId: string
  seats: ISeat[]
  totalCol: number
  totalRow: number
}

export interface ISeat {
  booked: boolean
  colIdx: number
  price: number
  rowIdx: number
  seatId: string
  seatName: string
  seatType: string
  status: string
}

export type TypeSeat = 'NORMAL' | 'VIP' | 'COUPLE' | 'DISABLED'
export type TypeSeatStatus = 'AVAILABLE' | 'BOOKED' | 'LOCKED'
