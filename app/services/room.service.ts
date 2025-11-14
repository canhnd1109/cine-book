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
  async updateRoom(roomId: string, body: Omit<IBodyRoom, 'cinemaId'>): Promise<IResponseMessage> {
    return this.put<IResponseMessage>(`/${roomId}`, body)
  }
  async deleteRoom(roomId: string): Promise<IResponseMessage> {
    return this.delete<IResponseMessage>(`/${roomId}`)
  }
}
