import { VoteBody } from '~/dto/req/vote/vote.req'
import { Vote } from '~/entities/vote.entity'
import { EVENTS } from '~/events/constants'
import eventBus from '~/events/eventBus'
import { unGetData } from '~/utils'

class VoteService {
  vote = async ({ targetId, targetType, user }: VoteBody) => {
    const foundVote = await Vote.findOne({
      where: {
        createdBy: { id: user.id },
        targetId,
        targetType
      },
      relations: {
        createdBy: true
      },
      withDeleted: true
    })

    if (!foundVote) {
      const newVote = Vote.create({
        createdBy: { id: user.id },
        targetId,
        targetType
      })

      return unGetData({ fields: ['createdBy', 'folder'], object: await newVote.save() })
    }

    await Vote.getRepository().restore({ id: foundVote.id })

    eventBus.emit(EVENTS.VOTE, {
      createdBy: user,
      ownerId: foundVote.createdBy.id,
      targetId: foundVote.targetId,
      targetType: foundVote.targetType
    })
    return foundVote
  }

  unVote = async ({ targetId, targetType, user }: VoteBody) => {
    return await Vote.getRepository().softDelete({
      createdBy: {
        id: user.id
      },
      targetId,
      targetType
    })
  }
}

export const voteService = new VoteService()
