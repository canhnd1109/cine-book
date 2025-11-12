import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'

export class GenreService extends BaseService {
  constructor() {
    super('genre')
  }
  async createGenre(genreName: string): Promise<IResponseMessage> {
    return this.post<IResponseMessage>(`/${genreName}`)
  }

  async updateGenre(genreId: string, genreName: string): Promise<IResponseMessage> {
    return this.put<IResponseMessage>(`/${genreId}`, { name: genreName })
  }
  async deleteGenre(genreId: string): Promise<IResponseMessage> {
    return this.delete<IResponseMessage>(`/${genreId}`)
  }
}
