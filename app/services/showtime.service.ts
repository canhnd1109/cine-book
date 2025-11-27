import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'
import type { ICreateShowtime } from '~/schemas/movie.chema'

export class ShowtimeService extends BaseService {
  constructor() {
    super('showtime')
  }
  async addShowtime(form: ICreateShowtime): Promise<IResponseMessage> {
    return this.post<IResponseMessage>('', form)
  }

  async updateShowtime(id: string, form: ICreateShowtime): Promise<IResponseMessage> {
    return this.put<IResponseMessage>(`/${id}`, form)
  }
  async deleteShowtime(id: string): Promise<IResponseMessage> {
    return this.delete<IResponseMessage>(`/${id}`)
  }
}
