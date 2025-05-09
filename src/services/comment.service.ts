import { Comment } from '~/entities/comment.entity'

class CommentService {
  findChildComment = async (parentId: number, topicId: number) => {
    const childComments = await Comment.findBy({
      parentComment: {
        id: parentId
      },
      topic: {
        id: topicId
      }
    })

    return childComments
  }
}

export const commentService = new CommentService()
