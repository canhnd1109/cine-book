import BaseService from '~/plugins/base'

export function useTheaterApi() {
  const theaterService = new BaseService('/theaters')

  const getTheaters = async (params?: {
    city?: string
    search?: string
  }) => {
    return theaterService.get('', params)
  }

  const getTheater = async (id: string) => {
    return theaterService.get(`/${id}`)
  }

  const getTheaterSchedules = async (theaterId: string, params?: {
    date?: string
    movieId?: string
  }) => {
    return theaterService.get(`/${theaterId}/schedules`, params)
  }

  return {
    getTheaters,
    getTheater,
    getTheaterSchedules
  }
}
