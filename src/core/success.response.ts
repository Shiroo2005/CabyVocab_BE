import { Response } from 'express'
import status from 'http-status'

export class SuccessResponse {
  message: string
  statusCode: number
  metaData: object

  constructor({
    message = status['200_NAME'],
    statusCode = status.OK,
    metaData = {}
  }: {
    message?: string
    statusCode?: number
    metaData?: object
  }) {
    this.message = message
    this.statusCode = statusCode
    this.metaData = metaData
  }

  send(res: Response) {
    res.status(this.statusCode).json(this)
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message = status['201_NAME'],
    metaData = {}
  }: {
    message?: string
    metaData?: object
    options?: object
  }) {
    super({
      message,
      statusCode: status.CREATED,
      metaData
    })
  }
}
