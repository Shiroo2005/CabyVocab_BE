import { Request, Response } from 'express'
import { CREATED } from '~/core/success.response'
import { uploadAudio, uploadImages } from '~/services/upload.service'

export const uploadImagesController = async (req: Request, res: Response) => {
  return new CREATED({
    message: 'Upload images successful!',
    metaData: await uploadImages(req.files as Record<string, Express.Multer.File[]>)
  }).send(res)
}

export const uploadAudiosController = async (req: Request, res: Response) => {
  return new CREATED({
    message: 'Upload audio successful!',
    metaData: await uploadAudio(req.file as Express.Multer.File)
  }).send(res)
}
