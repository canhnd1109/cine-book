import type { IResponseData, IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'
import type { IGenre } from '~/types/genre.type'

export class GenreService extends BaseService {
  constructor() {
    super('genre')
  }
  async addGenre(genreName: string): Promise<IResponseMessage> {
    return this.post<IResponseMessage, typeof genreName>(`/${genreName}`)
  }
}
