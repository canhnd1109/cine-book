export interface ICommentForm {
  content: string
  movieId: string
  parentCommentId?: string
}

export interface IComment {
  id: string
  author: string
  content: string
  totalChildComment: number
}
