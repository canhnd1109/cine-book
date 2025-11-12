import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'

export class MovieService extends BaseService {
  constructor() {
    super('movie')
  }
  async addMovie(formData: FormData): Promise<IResponseMessage> {
    return this.post<IResponseMessage>('', formData)
  }
  async updateMovie(movieId: string, formData: FormData): Promise<IResponseMessage> {
    return this.put<IResponseMessage>(`/${movieId}`, formData)
  }
}
