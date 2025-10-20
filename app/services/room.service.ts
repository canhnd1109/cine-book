import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'
import type { IBodyRoom } from '~/types/cinema.type'

export class RoomService extends BaseService {
  constructor() {
    super('room')
  }
  async addRoom(body: IBodyRoom): Promise<IResponseMessage> {
    return this.post<IResponseMessage>('', body)
  }
}
