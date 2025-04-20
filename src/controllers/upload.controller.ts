import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED } from '~/core/success.response'
import { UploadImageBodyReq } from '~/dto/req/upload/uploadImageBody.req'
import { uploadImages } from '~/services/upload.service'

export const uploadImagesController = async (
  req: Request<ParamsDictionary, any, UploadImageBodyReq>,
  res: Response
) => {
  return new CREATED({
    message: 'Upload images successful!',
    metaData: await uploadImages(req.files as Record<string, Express.Multer.File[]>, req.body.type)
  }).send(res)
}
