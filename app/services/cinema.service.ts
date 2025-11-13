import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'

export class CinemaService extends BaseService {
  constructor() {
    super('cinema')
  }
  async addCinema(formData: FormData): Promise<IResponseMessage> {
    return this.post<IResponseMessage>('', formData)
  }

  async editCinema(id: string, formData: FormData): Promise<IResponseMessage> {
    return this.put<IResponseMessage>(`/${id}`, formData)
  }
}
