import { TargetType } from '~/constants/target'
import { User } from '~/entities/user.entity'

export class VoteBody {
  user: User
  targetId: number
  targetType: TargetType
}
