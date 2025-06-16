import express from 'express'
import { FieldMaxCount } from '~/constants/upload'
import { uploadAudiosController, uploadImagesController } from '~/controllers/upload.controller'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { upload } from '~/services/upload.service'
import { wrapRequestHandler } from '~/utils/handler'
const uploadRouter = express.Router()

// GET

// authenticate....
uploadRouter.use(accessTokenValidation)

/**
 * @description : Upload image
 * @method : POST
 * @path : /images
 * @header : Authorization
 * @body : {
 *  type: string
 *  images: File[]
 * }
 * type in ['AVATAR', 'WORD']
 */
uploadRouter.post('/images', upload.fields(FieldMaxCount), wrapRequestHandler(uploadImagesController))

/**
 * @description : Upload image
 * @method : POST
 * @path : /images
 * @header : Authorization
 * @body : {
 *  type: string
 *  images: File[]
 * }
 * type in ['AVATAR', 'WORD']
 */
uploadRouter.post('/audios', upload.single('AUDIO'), wrapRequestHandler(uploadAudiosController))

export default uploadRouter
