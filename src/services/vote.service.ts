import { VoteBody } from '~/dto/req/vote/vote.req'
import { Vote } from '~/entities/vote.entity'
import { unGetData } from '~/utils'

class VoteService {
  vote = async ({ targetId, targetType, userId }: VoteBody) => {
    const foundVote = await Vote.findOne({
      where: {
        createdBy: { id: userId },
        targetId,
        targetType
      },
      withDeleted: true
    })

    if (!foundVote) {
      const newVote = Vote.create({
        createdBy: { id: userId },
        targetId,
        targetType
      })

      return unGetData({ fields: ['createdBy', 'folder'], object: await newVote.save() })
    }

    await Vote.getRepository().restore({ id: foundVote.id })
    return foundVote
  }

  unVote = async ({ targetId, targetType, userId }: VoteBody) => {
    return await Vote.getRepository().softDelete({
      createdBy: {
        id: userId
      },
      targetId,
      targetType
    })
  }
}

export const voteService = new VoteService()
