import { FindOptionsWhere } from 'typeorm'
import { TargetType } from '~/constants/target'
import { BadRequestError } from '~/core/error.response'
import { CreateCommentBodyReq } from '~/dto/req/comment/createCommentBody.req'
import { UpdateCommentBodyReq } from '~/dto/req/comment/updateCommentBody.req'
import { Comment } from '~/entities/comment.entity'
import { EVENTS } from '~/events/constants'
import eventBus from '~/events/eventBus'
import { unGetData } from '~/utils'

class CommentService {
  findChildComment = async (targetId: number, parentId: number | null, targetType: TargetType) => {
    const where: FindOptionsWhere<Comment> = {
      targetId: targetId,
      targetType
    }

    if (parentId !== null) {
      where.parentComment = { id: parentId }
    }

    const childComments = await Comment.find({
      where,
      select: {
        id: true,
        content: true,
        createdAt: true,
        createdBy: {
          id: true,
          username: true,
          email: true,
          avatar: true
        },
        parentComment: {
          id: true
        },
        targetId: true,
        targetType: true
      },
      relations: ['createdBy']
    })

    return childComments
  }

  comment = async ({ content, targetId, targetType, user, parentId = null }: CreateCommentBodyReq) => {
    const comment = Comment.create({
      content,
      createdBy: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar
      },
      parentComment: {
        id: parentId
      } as Comment,
      targetId,
      targetType
    })

    await comment.save()

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        createdBy: {
          id: true,
          username: true,
          email: true,
          avatar: true
        },
        parentComment: {
          id: true,
          createdBy: {
            id: true
          }
        },
        targetId: true,
        targetType: true
      },
      relations: ['createdBy', 'parentComment', 'parentComment.createdBy']
    })
    if (!fullComment) throw new BadRequestError({ message: 'Unauthorize for this comment' })

    //emit event
    eventBus.emit(EVENTS.COMMENT, {
      targetId,
      targetType,
      ownerId: fullComment.createdBy.id,
      createdBy: user,
      parentId,
      parentCommentOwnerId: fullComment.parentComment?.createdBy.id
    })

    return fullComment
  }

  updateComment = async ({ content, targetId, targetType, user, commentId }: UpdateCommentBodyReq) => {
    const foundComment = await Comment.findOne({
      where: {
        id: commentId,
        targetId,
        targetType,
        createdBy: {
          id: user.id
        }
      },
      relations: ['createdBy']
    })

    if (!foundComment) throw new BadRequestError({ message: 'Comment not found!' })

    //mapping
    foundComment.content = content

    return unGetData({
      object: await foundComment.save(),
      fields: [
        'createdBy.password',
        'createdBy.status',
        'createdBy.streak',
        'createdBy.lastStudyDate',
        'createdBy.totalStudyDay',
        'createdBy.balance',
        'createdBy.deletedAt',
        'createdBy.createdAt',
        'createdBy.updatedAt'
      ]
    })
  }

  async checkOwnComment(userId: number, commentId: number) {
    const foundComment = await Comment.exists({
      where: {
        id: commentId,
        createdBy: {
          id: userId
        }
      }
    })

    if (!foundComment) throw new BadRequestError({ message: 'Unauthorize for this comment' })
  }
}

export const commentService = new CommentService()
