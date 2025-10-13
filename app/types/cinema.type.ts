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
