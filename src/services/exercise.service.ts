import { Equal, FindOptionsOrder, In, Like } from 'typeorm'
import { lengthCode } from '~/constants/folder'
import { BadRequestError } from '~/core/error.response'
import { CreateCommentBodyReq } from '~/dto/req/exercise/comment/createCommentBody.req'
import { UpdateCommentBodyReq } from '~/dto/req/exercise/comment/updateCommentBody.req'
import { CreateFolderBodyReq } from '~/dto/req/exercise/createFolderBody.req'
import { folderQueryReq } from '~/dto/req/exercise/folderQuery.req'
import { updateFolderBodyReq } from '~/dto/req/exercise/updateFolderBody.req'
import { VoteFolder } from '~/dto/req/exercise/voteFolder.req'
import { Comment } from '~/entities/comment.entity'
import { FlashCard } from '~/entities/flashCard.entity'
import { Folder } from '~/entities/folder.entity'
import { Quiz } from '~/entities/quiz.entity'
import { User } from '~/entities/user.entity'
import { Vote } from '~/entities/vote.entity'
import { generatedUuid, unGetData } from '~/utils'
import { commentService } from './comment.service'
import { Order } from '~/entities/order.entity'
import { OrderQueryReq } from '~/dto/req/exercise/order/orderQuery.req'

class ExerciseService {
  createNewFolder = async ({ name, price }: CreateFolderBodyReq, userId: number) => {
    const createdFolder = await Folder.save({
      name,
      code: generatedUuid(lengthCode),
      createdBy: {
        id: userId
      },
      price
    })

    return createdFolder
  }

  checkOwn = async (userId: number, folderId: number) => {
    if (folderId != userId) throw new BadRequestError({ message: 'User not owner for this folder!' })
  }

  getAllFolder = async (userId: number, { page = 1, limit = 10, name, sort, code }: folderQueryReq) => {
    const skip = (page - 1) * limit
    const [folders, total] = await Folder.findAndCount({
      skip,
      take: limit,
      where: {
        name: Like(`%${name || ''}%`),
        code
      },
      order: sort,
      select: {
        id: true,
        name: true,
        createdBy: {
          id: true,
          username: true,
          avatar: true,
          email: true
        },
        code: true,
        price: true
      },
      relations: ['createdBY']
    })

    const data = await Promise.all(
      folders.map(async (folder) => {
        const [voteCount, isAlreadyVote, commentCount] = await Promise.all([
          await this.findNumberVoteByFolderId(folder.id),
          await this.isAlreadyVote(folder.id, userId),
          await this.findNumberCommentByFolderId(folder.id)
        ])
        return {
          ...folder,
          voteCount,
          commentCount,
          isAlreadyVote
        }
      })
    )

    return {
      folders: data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  updateFolder = async (user: User, id: number, { name, quizzes, flashCards, price }: updateFolderBodyReq) => {
    const foundFolder = await Folder.findOne({
      where: {
        id
      },
      relations: ['createdBy', 'quizzes', 'votes', 'votes.createdBy'],
      select: {
        id: true,
        name: true,
        code: true,
        createdBy: {
          id: true
        },
        quizzes: {
          id: true
        },
        flashCards: {
          id: true
        }
      }
    })

    if (!foundFolder) throw new BadRequestError({ message: 'Folder not found!' })

    //check whether user is own folder
    if (foundFolder.createdBy.id != user.id) throw new BadRequestError({ message: 'Can not update this folder!' })

    //mapping data
    if (name) foundFolder.name = name

    if (price) foundFolder.price = price

    //if quizzes was update
    if (quizzes) {
      //delete previous quiz
      await this.deleteQuizById(foundFolder.quizzes?.map((quiz) => quiz.id))

      const mappedQuiz = quizzes.map((quiz) => {
        return {
          title: quiz.title,
          question: quiz.question
        } as Quiz
      })

      foundFolder.quizzes = mappedQuiz
    }

    if (flashCards) {
      //delete previous quiz
      await this.deleteFlashCardById(foundFolder.flashCards?.map((flashCard) => flashCard.id))
      //mapping data
      const mappedFlashCard = flashCards.map((flashCard) => {
        return {
          frontContent: flashCard.frontContent,
          frontImage: flashCard.frontImage,
          backContent: flashCard.backContent,
          backImage: flashCard.backImage
        } as FlashCard
      })

      foundFolder.flashCards = mappedFlashCard
    }

    await foundFolder.save()
    return this.getFolderById(user.id as number, id)
  }

  getFolderById = async (userId: number, id: number) => {
    if (!(await this.isAbleToUseFolder(id, userId)))
      throw new BadRequestError({ message: 'User can not able to use this folder' })
    const foundFolder = await Folder.findOne({
      where: {
        id
      },
      relations: ['flashCards', 'quizzes', 'createdBy'],
      select: {
        id: true,
        name: true,
        code: true,
        flashCards: {
          id: true,
          frontContent: true,
          frontImage: true,
          backContent: true,
          backImage: true
        },
        quizzes: {
          id: true,
          question: true,
          title: true
        },
        createdBy: {
          id: true,
          avatar: true,
          email: true,
          username: true
        }
      }
    })

    const [voteCount, isAlreadyVote, commentCount] = await Promise.all([
      await this.findNumberVoteByFolderId(id),
      await this.isAlreadyVote(id, userId),
      await this.findNumberCommentByFolderId(id)
    ])

    //get comment
    const comments = await commentService.findChildComment(id, null)

    return {
      ...foundFolder,
      voteCount,
      commentCount,
      isAlreadyVote,
      comments
    }
  }

  findNumberVoteByFolderId = async (id: number) => {
    return Vote.countBy({
      folder: {
        id
      }
    })
  }

  findNumberCommentByFolderId = async (id: number) => {
    return Comment.countBy({
      folder: {
        id
      }
    })
  }

  isAlreadyVote = async (folderId: number, userId: number) => {
    return Vote.exists({
      where: {
        createdBy: {
          id: userId
        },
        folder: {
          id: folderId
        }
      },
      relations: ['createdBy'],
      withDeleted: false
    })
  }

  deleteQuizById = async (ids: number[]) => {
    if (!ids || ids.length === 0) return

    return await Quiz.getRepository().softDelete({
      id: In(ids)
    })
  }

  deleteFlashCardById = async (ids: number[]) => {
    if (!ids || ids.length === 0) return
    return await FlashCard.getRepository().softDelete({
      id: In(ids)
    })
  }

  deleteFolderById = async (userId: number, id: number) => {
    await this.checkOwn(userId, id)
    return await Folder.getRepository().softDelete({
      id
    })
  }

  voteFolder = async ({ folderId, userId }: VoteFolder) => {
    const foundVote = await Vote.findOne({
      where: {
        createdBy: { id: userId },
        folder: { id: folderId }
      },
      withDeleted: true
    })

    if (!foundVote) {
      const newVote = Vote.create({
        createdBy: { id: userId },
        folder: { id: folderId }
      })

      return unGetData({ fields: ['createdBy', 'folder'], object: await newVote.save() })
    }

    await Vote.getRepository().restore({ id: foundVote.id })
    return foundVote
  }

  unVoteFolder = async ({ folderId, userId }: VoteFolder) => {
    return await Vote.getRepository().softDelete({
      createdBy: {
        id: userId
      },
      folder: {
        id: folderId
      }
    })
  }

  commentFolder = async ({ content, folderId, userId, parentId = null }: CreateCommentBodyReq) => {
    const comment = Comment.create({
      content,
      createdBy: { id: userId },
      parentComment: {
        id: parentId
      } as Comment,
      folder: {
        id: folderId
      }
    })

    return await comment.save()
  }

  updateCommentFolder = async ({ content, folderId, userId, commentId }: UpdateCommentBodyReq) => {
    const foundComment = await Comment.findOne({
      where: {
        id: commentId,
        folder: {
          id: folderId
        },
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

  deleteCommentFolder = async (userId: number, commentId: number) => {
    this.checkOwnComment(userId, commentId)
    return await Comment.getRepository().softDelete({
      id: commentId
    })
  }

  findFolderById = async (id: number) => {
    return Folder.findOne({
      where: {
        id
      }
    })
  }

  getOrderHistoryByExerciseId = async (
    userId: number,
    id: number,
    { page = 1, limit = 10, bankName = '', email = '', username = '', sort }: OrderQueryReq
  ) => {
    const skip = (page - 1) * limit

    const [orders, total] = await Order.findAndCount({
      where: {
        id,
        createdBy: { id: userId },
        bankTranNo: Like(`%${bankName}%`),
        ...(username && { 'createdBy.username': Like(`%${username}%`) }),
        ...(email && { 'createdBy.email': Like(`%${email}%`) })
      },
      relations: ['createdBy'],
      skip,
      take: limit,
      select: {
        id: true,
        amount: true,
        bankTranNo: true,
        nameBank: true,
        status: true,
        createdBy: {
          id: true,
          avatar: true,
          username: true,
          email: true
        }
      },
      order: sort
    })

    return {
      orders,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  isAbleToUseFolder = async (folderId: number, userId: number) => {
    const folder = await Folder.findOneBy({ id: folderId })

    if (folder) {
      //free
      if (folder.price == 0) return true

      //not free
      const order = await Order.findOneBy({
        createdBy: {
          id: userId
        },
        folder: {
          id: folderId
        }
      })

      if (!order) return false
    }

    return true
  }
}

export const exerciseService = new ExerciseService()
