import type { IResponseData } from '~/types/response.type'
import BaseService from './base.service'
import type { IGenre } from '~/types/genre.type'

export class SharedService extends BaseService {
  constructor() {
    super('')
  }

  async fetchAllGenre(): Promise<IResponseData<IGenre[]>> {
    return this.get<IResponseData<IGenre[]>>(`/public-api`)
  }
}
