import { TargetType } from '~/constants/target'

export class VoteBody {
  userId: number
  targetId: number
  targetType: TargetType
}
