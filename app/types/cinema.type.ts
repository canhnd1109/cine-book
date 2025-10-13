import type { IFormCinema } from '~/schemas/cinema.chema'

export interface ICinemaFilter {
  keyWord: string
}

export type IFormState = Omit<IFormCinema, 'province' | 'commune'> & {
  province: string
  commune: string
}
