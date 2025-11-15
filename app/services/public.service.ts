import type { IResponseData, IResponsePagination } from '~/types/response.type'
import BaseService from './base.service'
import type { IGenre, IGenreFilter } from '~/types/genre.type'
import type { IMovie, IMovieFilter } from '~/types/movie.type'
import type { ICinema, ICinemaFilter, IRoom } from '~/types/cinema.type'
import type { IShowtime } from '~/types/show-time.type'
import type { IBooking } from '~/types/booking.type'

export class PublicService extends BaseService {
  constructor() {
    super('public-api')
  }

  // TODO: GENRE
  async fetchGenre(params: IGenreFilter): Promise<IResponseData<IGenre[]>> {
    return this.get<IResponseData<IGenre[]>>(`/genre`, normalizedParams(params))
  }

  // TODO: MOVIE
  async fetchMovies(params: IMovieFilter): Promise<IResponseData<IResponsePagination<IMovie[]>>> {
    return this.get<IResponseData<IResponsePagination<IMovie[]>>>('/movie/filter', normalizedParams(params))
  }
  async getMovieDetail(movieId: string): Promise<IResponseData<IMovie>> {
    return this.get<IResponseData<IMovie>>(`/movie/${movieId}`)
  }
  async fetchShowingMovies(): Promise<IResponseData<IResponsePagination<IMovie[]>>> {
    return this.get<IResponseData<IResponsePagination<IMovie[]>>>('/movie/showing')
  }
  async fetchUpcomingMovies(): Promise<IResponseData<IResponsePagination<IMovie[]>>> {
    return this.get<IResponseData<IResponsePagination<IMovie[]>>>('/movie/upcoming')
  }

  async fetchMoviesByDay(day: string): Promise<IResponseData<IMovie[]>> {
    return this.get<IResponseData<IMovie[]>>(`/movie/by-date/${day}`)
  }

  //TODO: CINEMA
  async fetchCinemas(params: ICinemaFilter): Promise<IResponseData<ICinema[]>> {
    return this.get<IResponseData<ICinema[]>>('/cinema/key', normalizedParams(params))
  }

  async fetchAllCinemas(): Promise<IResponseData<ICinema[]>> {
    return this.get<IResponseData<ICinema[]>>('/cinema/key')
  }

  async getCinemaDetail(cinemaId: string): Promise<IResponseData<ICinema>> {
    return this.get<IResponseData<ICinema>>(`/cinema/${cinemaId}`)
  }

  //TODO: ROOM
  async fetchRooms(cinemaId: string): Promise<IResponseData<IRoom[]>> {
    return this.get<IResponseData<IRoom[]>>(`/room/cinema/${cinemaId}`)
  }

  async getRoomDetail(roomId: string): Promise<IResponseData<IRoom>> {
    return this.get<IResponseData<IRoom>>(`/room/${roomId}`)
  }

  async fetchRoomsOfCinema(cinemaId: string): Promise<IResponseData<{ roomId: string; name: string }>> {
    return this.get<IResponseData<{ roomId: string; name: string }>>(`/room/cinema/${cinemaId}/simple`)
  }

  // TODO: SHOWTIME
  async fetchShowtimesByMovie(movieId: string): Promise<IResponseData<IShowtime[]>> {
    return this.get<IResponseData<IShowtime[]>>(`/showtime/${movieId}`)
  }

  // TODO: BOOKING
  async fetchBooking(): Promise<IResponseData<IBooking[]>> {
    return this.get<IResponseData<IBooking[]>>(`/booking/`)
  }
  async getBookingDetail(id: string): Promise<IResponseData<IBooking[]>> {
    return this.get<IResponseData<IBooking[]>>(`/booking/${id}`)
  }
}
