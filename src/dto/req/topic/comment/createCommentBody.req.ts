export class CreateCommentBodyReq {
  content: string
  userId: number
  topicId: number
  parentId: number | null
}
