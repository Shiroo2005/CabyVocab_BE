import { Comment } from '~/entities/comment.entity'

class CommentService {
  findChildComment = async (parentId: number, folderId: number) => {
    const childComments = await Comment.findBy({
      parentComment: {
        id: parentId
      },
      folder: {
        id: folderId
      }
    })

    return childComments
  }
}

export const commentService = new CommentService()
