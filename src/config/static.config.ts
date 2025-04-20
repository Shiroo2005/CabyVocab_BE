import express from 'express'
import { UPLOAD_FOLDER } from '~/constants/dir'

export const servingStaticConfig = (app: express.Express) => {
  app.use('/uploads', express.static(UPLOAD_FOLDER))
}
