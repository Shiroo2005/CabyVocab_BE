import { TargetType } from '~/constants/target'
import { BadRequestError } from '~/core/error.response'
import { CreatePostBodyReq } from '~/dto/req/post/createPostBody.req'
import { UpdatePostBodyReq } from '~/dto/req/post/updatePostBody.req'
import { Comment } from '~/entities/comment.entity'
import { Post } from '~/entities/post.entity'
import { User } from '~/entities/user.entity'
import { Vote } from '~/entities/vote.entity'
import { commentService } from './comment.service'
import { postQueryReq } from '~/dto/req/post/postQuery.req'
import { FindOptionsWhere, ILike, Raw } from 'typeorm'

class PostService {
  getPostById = async (userId: number, id: number) => {
    const foundPost = await Post.findOne({
      where: {
        id
      },
      select: {
        id: true,
        content: true,
        tags: true,
        thumbnails: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          username: true,
          avatar: true,
          email: true
        }
      },
      relations: ['createdBy']
    })

    const [voteCount, isAlreadyVote, commentCount] = await Promise.all([
      await this.findNumberVoteByPostId(id),
      await this.isAlreadyVote(id, userId),
      await this.findNumberCommentByPostId(id)
    ])

    //get comment
    const comments = await commentService.findChildComment(id, null, TargetType.POST)

    return {
      ...foundPost,
      voteCount,
      commentCount,
      isAlreadyVote,
      comments
    }
  }

  getAllPost = async (userId: number, { page = 1, limit = 10, sort, content, tag, ownerId }: postQueryReq) => {
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<Post> = {}

    if (content) {
      where.content = ILike(`%${content}%`)
    }

    if (tag) {
      where.tags = Raw((alias) => `JSON_CONTAINS(${alias}, '[${tag}]')`)
    }

    if (ownerId) {
      where.createdBy = { id: ownerId }
    }

    const [posts, total] = await Post.findAndCount({
      where,
      skip,
      take: limit,
      order: { ...sort, createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        tags: true,
        thumbnails: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          username: true,
          avatar: true,
          email: true
        }
      },
      relations: ['createdBy']
    })

    const data = await Promise.all(
      posts.map(async (post) => {
        const [voteCount, isAlreadyVote, commentCount] = await Promise.all([
          this.findNumberVoteByPostId(post.id),
          this.isAlreadyVote(post.id, userId),
          this.findNumberCommentByPostId(post.id)
        ])
        return {
          ...post,
          voteCount,
          commentCount,
          isAlreadyVote
        }
      })
    )
    return {
      posts: data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  create = async (userId: number, { content, tags = [], thumbnails = [] }: CreatePostBodyReq) => {
    const post = new Post()
    post.createdBy = { id: userId } as User
    post.content = content
    post.tags = tags
    post.thumbnails = thumbnails

    return await post.save()
  }

  checkOwn = (userId: number, post: Post) => {
    if (post.createdBy.id != userId) throw new BadRequestError({ message: 'User can not edit this post!' })
  }

  update = async (userId: number, postId: number, { content, tags, thumbnails }: UpdatePostBodyReq) => {
    const foundPost = await Post.findOne({
      where: {
        id: postId
      },
      select: {
        content: true,
        id: true,
        createdBy: {
          id: true
        },
        thumbnails: true,
        tags: true
      },
      relations: ['createdBy']
    })

    if (!foundPost) throw new BadRequestError({ message: 'Post id invalid!' })

    this.checkOwn(userId, foundPost)

    //update post
    if (content) foundPost.content = content
    if (tags) foundPost.tags = tags
    if (thumbnails) foundPost.thumbnails = thumbnails

    return await foundPost.save()
  }

  findNumberVoteByPostId = async (id: number) => {
    return Vote.countBy({
      targetId: id,
      targetType: TargetType.POST
    })
  }

  isAlreadyVote = async (postId: number, userId: number) => {
    return Vote.exists({
      where: {
        createdBy: {
          id: userId
        },
        targetId: postId,
        targetType: TargetType.POST
      },
      relations: ['createdBy'],
      withDeleted: false
    })
  }

  findNumberCommentByPostId = async (id: number) => {
    return Comment.countBy({
      targetId: id,
      targetType: TargetType.POST
    })
  }

  deleteById = async (user: User, id: number) => {
    const foundPost = await Post.findOne({
      where: {
        id
      },
      relations: ['createdBy']
    })
    if (foundPost) {
      if (user.role?.name == 'ADMIN' || user.id == foundPost.createdBy.id) {
        await foundPost.softRemove()
      }
    }
    return {}
  }

  deleteCommentPost = async (userId: number, commentId: number) => {
    commentService.checkOwnComment(userId, commentId)
    return await Comment.getRepository().softDelete({
      id: commentId
    })
  }
}

export const postService = new PostService()
