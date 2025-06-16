import { TargetType } from '~/constants/target'
import { User } from '~/entities/user.entity'

export class CreateCommentBodyReq {
  content: string
  user: User
  targetId: number
  targetType: TargetType
  parentId: number | null
}
