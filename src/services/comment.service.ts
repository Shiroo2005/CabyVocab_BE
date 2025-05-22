import { Comment } from '~/entities/comment.entity'

class CommentService {
  findChildComment = async (folderId: number, parentId: number | null) => {
    const where: any = {
      folder: { id: folderId }
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
        }
      },
      relations: ['createdBy']
    })

    return childComments
  }
}

export const commentService = new CommentService()
