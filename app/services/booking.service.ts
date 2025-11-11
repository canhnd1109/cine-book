import type { IResponseData } from '~/types/response.type'
import BaseService from './base.service'

export class BookingService extends BaseService {
  constructor() {
    super('booking')
  }
  async booking(body: { showtimeId: string; seatIds: string[] }): Promise<IResponseData<string>> {
    return this.post<IResponseData<string>>('', body)
  }
}
