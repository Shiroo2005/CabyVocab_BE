import { In, Like, Not } from 'typeorm'
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
import { UserAttempt } from '~/entities/userAttemp.entity'

class ExerciseService {
  createNewFolder = async ({ name, price, isPublic }: CreateFolderBodyReq, userId: number) => {
    const createdFolder = await Folder.save({
      name,
      code: generatedUuid(lengthCode),
      createdBy: {
        id: userId
      },
      price,
      isPublic
    })

    return createdFolder
  }

  checkOwn = async (userId: number, folderId: number) => {
    const foundFolder = await Folder.findOne({
      where: {
        id: folderId
      },
      relations: ['createdBy']
    })
    if (foundFolder?.createdBy.id != userId) throw new BadRequestError({ message: 'User not owner for this folder!' })
  }

  getAllFolder = async (userId: number, { page = 1, limit = 10, name, sort, code }: folderQueryReq) => {
    const skip = (page - 1) * limit

    const [folders, total] = await Folder.findAndCount({
      skip,
      take: limit,
      where: [
        {
          name: Like(`%${name || ''}%`),
          code,
          isPublic: true
        },
        { name: Like(`%${name || ''}%`), code, createdBy: { id: userId } }
      ],
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
        price: true,
        createdAt: true,
        flashCards: {
          id: true
        },
        isPublic: true
      },
      relations: {
        createdBy: true,
        flashCards: true
      }
    })

    const data = await Promise.all(
      folders.map(async (folder) => {
        const [voteCount, isAlreadyVote, commentCount, totalAttemptCount] = await Promise.all([
          this.findNumberVoteByFolderId(folder.id),
          this.isAlreadyVote(folder.id, userId),
          this.findNumberCommentByFolderId(folder.id),
          this.getTotalAttemptFolder(folder.id)
        ])
        return {
          ...folder,
          voteCount,
          commentCount,
          isAlreadyVote,
          totalAttemptCount
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

  getTotalAttemptFolder = async (folderId: number) => {
    const quiz = await Quiz.findOne({
      where: {
        folder: {
          id: folderId
        }
      }
    })

    if (!quiz) return 0

    const count = await UserAttempt.count({
      where: {
        quiz: {
          id: quiz.id
        }
      }
    })

    return count
  }

  updateFolder = async (
    user: User,
    id: number,
    { name, quizzes, flashCards, price, isPublic }: updateFolderBodyReq
  ) => {
    const foundFolder = await Folder.findOne({
      where: {
        id
      },
      relations: ['createdBy', 'quizzes'],
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

    if (isPublic != null) {
      foundFolder.isPublic = isPublic
    }

    await foundFolder.save()
    return this.getFolderById(user.id as number, id)
  }

  getOwnFolder = async (userId: number) => {
    return await Folder.find({
      where: {
        createdBy: {
          id: userId
        }
      },
      select: {
        id: true,
        isPublic: true,
        code: true,
        flashCards: true,
        name: true,
        price: true,
        createdAt: true,
        quizzes: true,
        createdBy: {
          id: true
        }
      },
      relations: {
        createdBy: true,
        flashCards: true,
        quizzes: true
      }
    })
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
        },
        price: true,
        isPublic: true
      }
    })

    if (!foundFolder) {
      return {}
    }

    const [voteCount, isAlreadyVote, commentCount] = await Promise.all([
      await this.findNumberVoteByFolderId(id),
      await this.isAlreadyVote(id, userId),
      await this.findNumberCommentByFolderId(id)
    ])

    //get comment
    const comments = await commentService.findChildComment(id, null, TargetType.FOLDER)

    const countAttempt = await this.getTotalAttemptFolder(id)

    return {
      ...foundFolder,
      voteCount,
      commentCount,
      isAlreadyVote,
      comments,
      countAttempt
    }
  }

  findCountAttempt = async (folderId: number, userId: number) => {
    const foundQuiz = await Folder.findOne({
      where: {
        id: folderId
      },
      relations: {
        quizzes: true
      }
    })

    if (foundQuiz) {
      const foundAttempt = await UserAttempt.findOne({
        where: {
          quiz: {
            id: foundQuiz.id
          }
        }
      })

      if (foundAttempt) return foundAttempt.count
    }

    //not do before
    return 0
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

  checkQuizIdValid = async (quizId: number) => {
    const foundQuiz = await Quiz.findOneBy({ id: quizId })

    if (foundQuiz != null) return true
    return false
  }

  updateCountAttemptQuiz = async ({ quizId, userId }: { quizId: number; userId: number }) => {
    //checkQuizId

    if (!(await this.checkQuizIdValid(quizId))) throw new BadRequestError({ message: 'Quiz id invalid' })

    const foundAttemptQuiz = await UserAttempt.findOne({
      where: {
        quiz: {
          id: quizId
        },
        user: {
          id: userId
        }
      }
    })
    //not found ==> first attempt
    if (!foundAttemptQuiz) {
      const newAttempt = new UserAttempt()
      newAttempt.count = 1
      newAttempt.user = {
        id: userId
      } as User

      newAttempt.quiz = {
        id: quizId
      } as Quiz

      await newAttempt.save()
      return {}
    }

    //update
    foundAttemptQuiz.count += 1
    await foundAttemptQuiz.save()
    return {}
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

  deleteFolderById = async (user: User, id: number) => {
    const foundFolder = await Folder.findOne({
      where: {
        id
      },
      relations: {
        createdBy: true
      }
    })

    if (foundFolder && (foundFolder.createdBy.id == user.id || user.role?.name == 'ADMIN'))
      await foundFolder.softRemove()
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
        id,
        isPublic: true
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

      //if folder not public and folder was not own by this user
      if (!folder.isPublic) return false

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

  getStatistics = async () => {
    // Tổng số lượng folder
    const totalFolders = await Folder.count()

    // Số lượng folder miễn phí và có phí
    const freeFolders = await Folder.count({ where: { price: 0 } })
    const paidFolders = await Folder.count({ where: { price: Not(0) } })

    // Giá trung bình của folder có phí
    const paidFoldersData = await Folder.createQueryBuilder('folder')
      .select('AVG(folder.price)', 'avgPrice')
      .where('folder.price > 0')
      .getRawOne()
    const avgPrice = parseFloat(paidFoldersData?.avgPrice || '0')

    // Top folder phổ biến theo số lần attempt
    const rawTopFolders = await Folder.createQueryBuilder('folder')
      .leftJoin('folder.quizzes', 'quiz')
      .leftJoin(UserAttempt, 'attempt', 'quiz.id = attempt.quizId')
      .select('folder.id', 'id')
      .addSelect('folder.name', 'name')
      .addSelect('COUNT(attempt.id)', 'attemptCount')
      .groupBy('folder.id')
      .orderBy('attemptCount', 'DESC')
      .limit(5)
      .getRawMany()

    const topFolders = rawTopFolders.map((item) => ({
      ...item,
      attemptCount: parseInt(item.attemptCount, 10)
    }))

    return {
      totalFolders,
      freeFolders,
      paidFolders,
      avgPaidFolderPrice: avgPrice,
      topFolders
    }
  }
}

export const exerciseService = new ExerciseService()
