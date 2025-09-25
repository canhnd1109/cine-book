import BaseService from '~/plugins/base'

export function useMovieApi() {
  const movieService = new BaseService('/movies')

  const getMovies = async (params?: {
    page?: number
    limit?: number
    genre?: string
    search?: string
    sortBy?: string
  }) => {
    return movieService.get('', params)
  }

  const getMovie = async (id: string) => {
    return movieService.get(`/${id}`)
  }

  const getMovieSchedules = async (movieId: string, params?: {
    date?: string
    theaterId?: string
  }) => {
    return movieService.get(`/${movieId}/schedules`, params)
  }

  const getMovieReviews = async (movieId: string, params?: {
    page?: number
    limit?: number
  }) => {
    return movieService.get(`/${movieId}/reviews`, params)
  }

  const addMovieReview = async (movieId: string, data: {
    rating: number
    comment: string
  }) => {
    return movieService.postWithResponse(`/${movieId}/reviews`, data)
  }

  return {
    getMovies,
    getMovie,
    getMovieSchedules,
    getMovieReviews,
    addMovieReview
  }
}
