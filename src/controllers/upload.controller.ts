import { Request, Response } from 'express'
import { CREATED } from '~/core/success.response'
import { uploadImages } from '~/services/upload.service'

export const uploadImagesController = async (req: Request, res: Response) => {
  return new CREATED({
    message: 'Upload images successful!',
    metaData: await uploadImages(req.files as Record<string, Express.Multer.File[]>)
  }).send(res)
}
