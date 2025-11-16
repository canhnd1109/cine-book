import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'
import type { ICommentForm } from '~/types/comment.type'

export class CommentService extends BaseService {
  constructor() {
    super('comment')
  }
  async createComment(body: ICommentForm): Promise<IResponseMessage> {
    return this.post<IResponseMessage>('', body)
  }
}
