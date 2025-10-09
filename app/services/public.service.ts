import type { IResponseData, IResponsePagination } from '~/types/response.type'
import BaseService from './base.service'
import type { IGenre, IGenreFilter } from '~/types/genre.type'
import type { IMovie, IMovieFilter } from '~/types/movie.type'

export class PublicService extends BaseService {
  constructor() {
    super('public-api')
  }

  // TODO: GENRE
  async fetchGenre(params: IGenreFilter): Promise<IResponseData<IGenre[]>> {
    return this.get<IResponseData<IGenre[]>>(``, normalizedParams(params))
  }

  // TODO: MOVIE
  async fetchMovies(params: IMovieFilter): Promise<IResponseData<IResponsePagination<IMovie[]>>> {
    return this.get<IResponseData<IResponsePagination<IMovie[]>>>('/movie/filter', normalizedParams(params))
  }
}
