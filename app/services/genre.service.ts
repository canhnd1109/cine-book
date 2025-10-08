import type { IResponseData, IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'
import type { IGenre, IGenreFilter } from '~/types/genre.type'

export class GenreService extends BaseService {
  constructor() {
    super('')
  }
  async addGenre(genreName: string): Promise<IResponseMessage> {
    return this.post<IResponseMessage, typeof genreName>(`/genre/${genreName}`)
  }

  async fetchGenre(params: IGenreFilter): Promise<IResponseData<IGenre[]>> {
    return this.get<IResponseData<IGenre[]>>(`/public-api`, normalizedParams(params))
  }
}
