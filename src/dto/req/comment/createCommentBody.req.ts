import { TargetType } from '~/constants/target'

export class CreateCommentBodyReq {
  content: string
  userId: number
  targetId: number
  targetType: TargetType
  parentId: number | null
}
