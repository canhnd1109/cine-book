import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'

export class GenreService extends BaseService {
  constructor() {
    super('genre')
  }
  async addGenre(genreName: string): Promise<IResponseMessage> {
    return this.post<IResponseMessage, typeof genreName>(`/${genreName}`)
  }

  async deleteGenre(genreId: string): Promise<IResponseMessage> {
    return this.delete<IResponseMessage>(`/${genreId}`)
  }
}
