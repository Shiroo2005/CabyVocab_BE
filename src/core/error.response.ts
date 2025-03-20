import status from 'http-status'
export class ErrorResponse extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message = status[400], statusCode = status.BAD_REQUEST) {
    super(message, statusCode)
  }
}

export class AuthRequestError extends ErrorResponse {
  constructor(message = status[401], statusCode = status.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

export class NotFoundRequestError extends ErrorResponse {
  constructor(message = status[404], statusCode = status.NOT_FOUND) {
    super(message, statusCode)
  }
}

export class ForbiddenRequestError extends ErrorResponse {
  constructor(message = status[403], statusCode = status.FORBIDDEN) {
    super(message, statusCode)
  }
}
