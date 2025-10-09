import type { IResponseData } from '~/types/response.type'
import BaseService from './base.service'
import type { IGenre, IGenreFilter } from '~/types/genre.type'

export class PublicService extends BaseService {
  constructor() {
    super('public-api')
  }

  // TODO: GENRE
  async fetchGenre(params: IGenreFilter): Promise<IResponseData<IGenre[]>> {
    return this.get<IResponseData<IGenre[]>>(``, normalizedParams(params))
  }
}
