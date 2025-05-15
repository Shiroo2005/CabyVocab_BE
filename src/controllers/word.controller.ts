import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { getWordPosition } from '~/constants/word'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateWordBodyReq } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { wordService } from '~/services/word.service'

class WordController {
  createWords = async (req: Request<ParamsDictionary, any, CreateWordBodyReq>, res: Response) => {
    return new CREATED({
      message: 'Create word successful!',
      metaData: await wordService.createWords(req.body.words)
    }).send(res)
  }

  updateWord = async (req: Request<ParamsDictionary, any, UpdateWordBodyReq>, res: Response) => {
    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Update word by id successful!',
      metaData: await wordService.updateWord(id, req.body)
    }).send(res)
  }

  getWordById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Get word by id successful!',
      metaData: await wordService.getWordById({ id })
    }).send(res)
  }

  // getWorkRankList = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
  //   return new SuccessResponse({
  //     message: 'Get word rank successful!',
  //     metaData: {
  //       data: getWorkRank()
  //     }
  //   }).send(res)
  // }

  getWordPosition = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: 'Get word position successful!',
      metaData: {
        data: getWordPosition()
      }
    }).send(res)
  }

  getAllWords = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    return new SuccessResponse({
      message: 'Get all words successfully',
      metaData: await wordService.getAllWords({
        ...req.query,
        ...req.parseQueryPagination,
        sort: req.sortParsed
      })
    }).send(res)
  }

  deleteWordById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Delete word by id successful!',
      metaData: await wordService.deleteWordById({ id })
    }).send(res)
  }

  restoreWord = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Restore word by id successful!',
      metaData: await wordService.restoreWordById({ id })
    }).send(res)
  }
}

export const wordController = new WordController()
