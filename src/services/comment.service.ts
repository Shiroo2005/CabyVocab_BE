import { FindOptionsWhere } from 'typeorm'
import { TargetType } from '~/constants/target'
import { BadRequestError } from '~/core/error.response'
import { CreateCommentBodyReq } from '~/dto/req/comment/createCommentBody.req'
import { UpdateCommentBodyReq } from '~/dto/req/comment/updateCommentBody.req'
import { Comment } from '~/entities/comment.entity'

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

  comment = async ({ content, targetId, targetType, userId, parentId = null }: CreateCommentBodyReq) => {
    const comment = Comment.create({
      content,
      createdBy: { id: userId },
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
        id: true
      },
      targetId: true,
      targetType: true
    },
    relations: ['createdBy', 'parentComment']
    })
    if (!fullComment) throw new BadRequestError({ message: 'Unauthorize for this comment' })
    return fullComment || null
  }

  updateComment = async ({ content, targetId, targetType, userId, commentId }: UpdateCommentBodyReq) => {
    const foundComment = await Comment.findOne({
      where: {
        id: commentId,
        targetId,
        targetType,
        createdBy: {
          id: userId
        }
      }
    })

    if (!foundComment) throw new BadRequestError({ message: 'Comment not found!' })

    //mapping
    foundComment.content = content

    return await foundComment.save()
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
