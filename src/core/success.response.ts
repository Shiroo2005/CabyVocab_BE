'use strict'

import { Response } from 'express'
import status from 'http-status'

class SuccessResponse {
  message: string
  statusCode: number
  metaData: object

  constructor({
    message = status['200_NAME'],
    statusCode = status.OK,
    metaData = {}
  }: {
    message: string
    statusCode: number
    metaData: object
  }) {
    this.message = message
    this.statusCode = statusCode
    this.metaData = metaData
  }

  send(res: Response) {
    res.status(this.statusCode).json(this)
  }
}

class CREATED extends SuccessResponse {
  constructor({ message = status['201_NAME'], metaData = {}, options = {} }) {
    super({
      message,
      statusCode: status.CREATED,
      metaData
    })
  }
}

module.exports = {
  CREATED,
  SuccessResponse
}
