import { In, Like } from 'typeorm'
import { lengthCode } from '~/constants/folder'
import { BadRequestError } from '~/core/error.response'
import { CreateFolderBodyReq } from '~/dto/req/exercise/createFolderBody.req'
import { folderQueryReq } from '~/dto/req/exercise/folderQuery.req'
import { updateFolderBodyReq } from '~/dto/req/exercise/updateFolderBody.req'
import { Comment } from '~/entities/comment.entity'
import { FlashCard } from '~/entities/flashCard.entity'
import { Folder } from '~/entities/folder.entity'
import { Quiz } from '~/entities/quiz.entity'
import { User } from '~/entities/user.entity'
import { Vote } from '~/entities/vote.entity'
import { generatedUuid } from '~/utils'
import { commentService } from './comment.service'
import { Order } from '~/entities/order.entity'
import { OrderQueryReq } from '~/dto/req/exercise/order/orderQuery.req'
import { TargetType } from '~/constants/target'

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
      order: { ...sort, createdAt: 'desc' },
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
      relations: ['createdBy']
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
    const comments = await commentService.findChildComment(id, null, TargetType.FOLDER)

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
      targetId: id,
      targetType: TargetType.FOLDER
    })
  }

  findNumberCommentByFolderId = async (id: number) => {
    return Comment.countBy({
      targetId: id,
      targetType: TargetType.FOLDER
    })
  }

  isAlreadyVote = async (folderId: number, userId: number) => {
    return Vote.exists({
      where: {
        createdBy: {
          id: userId
        },
        targetId: folderId,
        targetType: TargetType.FOLDER
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

  deleteCommentFolder = async (userId: number, commentId: number) => {
    commentService.checkOwnComment(userId, commentId)
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
      //check own
      try {
        await this.checkOwn(userId, folderId)
        return true
      } catch (error) {
        /* empty */
      }

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
