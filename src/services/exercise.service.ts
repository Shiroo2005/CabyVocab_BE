import { Equal, In, Like } from 'typeorm'
import { lengthCode } from '~/constants/folder'
import { BadRequestError } from '~/core/error.response'
import { CreateFolderBodyReq } from '~/dto/req/exercise/createFolderBody.req'
import { folderQueryReq } from '~/dto/req/exercise/folderQuery.req'
import { updateFolderBodyReq } from '~/dto/req/exercise/updateFolderBody.req'
import { FlashCard } from '~/entities/flashCard.entity'
import { Folder } from '~/entities/folder.entity'
import { Quiz } from '~/entities/quiz.entity'
import { User } from '~/entities/user.entity'
import { generatedUuid } from '~/utils'

class ExerciseService {
  createNewFolder = async ({ name }: CreateFolderBodyReq, userId: number) => {
    const createdFolder = await Folder.save({
      name,
      code: generatedUuid(lengthCode),
      createdBy: {
        id: userId
      }
    })

    return createdFolder
  }

  checkOwn = async (userId: number, folderId: number) => {
    if (folderId != userId) throw new BadRequestError({ message: 'Can not update this folder!' })
  }

  getAllFolder = async ({ page = 1, limit = 10, name, sort, code }: folderQueryReq) => {
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
        createdBy: true
      }
    })

    return {
      folders,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  updateFolder = async (user: User, id: number, { name, quizzes, flashCards }: updateFolderBodyReq) => {
    const foundFolder = await Folder.findOne({
      where: {
        id
      },
      relations: ['createdBy', 'quizzes'],
      select: {
        id: true,
        name: true,
        createdBy: {
          id: true
        },
        quizzes: {
          id: true
        }
      }
    })

    if (!foundFolder) throw new BadRequestError({ message: 'Folder not found!' })

    //check whether user is own folder
    if (foundFolder.createdBy.id != user.id) throw new BadRequestError({ message: 'Can not update this folder!' })

    //mapping data
    if (name) foundFolder.name = name

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
    return this.getFolderById(id)
  }

  getFolderById = async (id: number) => {
    const foundFolder = await Folder.findOne({
      where: {
        id
      },
      relations: ['flashCards', 'quizzes'],
      select: {
        id: true,
        name: true,
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
        }
      }
    })

    return foundFolder || {}
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
}

export const exerciseService = new ExerciseService()
