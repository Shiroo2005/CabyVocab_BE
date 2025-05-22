import { TargetType } from '~/constants/target'

export class UpdateCommentBodyReq {
  content: string
  userId: number
  targetId: number
  targetType: TargetType
  commentId: number
}
