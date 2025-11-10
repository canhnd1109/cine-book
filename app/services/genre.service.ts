import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'

export class GenreService extends BaseService {
  constructor() {
    super('genre')
  }
  async createGenre(genreName: string): Promise<IResponseMessage> {
    return this.post<IResponseMessage>(`/${genreName}`)
  }

  async updateGenre(genreName: string): Promise<IResponseMessage> {
    return this.post<IResponseMessage>(`/${genreName}`)
  }
  async deleteGenre(genreId: string): Promise<IResponseMessage> {
    return this.delete<IResponseMessage>(`/${genreId}`)
  }
}
