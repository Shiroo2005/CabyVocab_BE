export class CreateCommentBodyReq {
  content: string
  userId: number
  folderId: number
  parentId: number | null
}
