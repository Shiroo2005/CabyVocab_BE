import { TargetType } from '~/constants/target'
import { User } from '~/entities/user.entity'

export class UpdateCommentBodyReq {
  content: string
  user: User
  targetId: number
  targetType: TargetType
  commentId: number
}
