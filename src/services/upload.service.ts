import { Request } from 'express'
import multer from 'multer'
import fs from 'fs'
import { ensureFolderExists } from '~/utils/file'
import sharp from 'sharp'
import path from 'path'
import { FolderUpload } from '~/constants/upload'
import { env } from 'process'
import { promisify } from 'util'

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const folder = 'uploads/temp'

    if (file.mimetype?.includes('image/'))
      //create folder if not exist
      ensureFolderExists(folder)

    cb(null, folder)
  },
  filename: (req: Request, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

export const uploadImages = async (files: Record<string, Express.Multer.File[]>) => {
  // convert to array
  const fileArray: Express.Multer.File[] = Object.values(files).flat()

  const _files = await Promise.all(fileArray.map((file) => processAndSaveImage(file)))

  // delete temp files
  // fileArray.map((file) => {
  //   unlinkAsync(file.path)
  // })

  return _files
}

// resize, tojpeg and save
export const processAndSaveImage = async (file: Express.Multer.File) => {
  // find folder for type images
  const fileType = file.fieldname
  let folder = 'others'

  const foundFolder = Object.keys(FolderUpload).filter((type) => type == fileType)
  if (foundFolder && foundFolder.length == 1) folder = FolderUpload[foundFolder[0] as keyof typeof FolderUpload]

  // create folder if not exist
  ensureFolderExists(`uploads/${folder}`)

  const filePath = path.resolve(file.path)
  const destinationPath = path.resolve('uploads', folder)
  const newFileName = `${Date.now()}-${path.parse(file.originalname).name}.jpeg`
  const destinationFile = path.join(destinationPath, newFileName)

  // Use local network IP or emulator addresses
  const hostUrl = env.HOST_URL?.replace('localhost', '10.0.2.2') || 'http://10.0.2.2:8081'
  const urlImage = `${hostUrl}/uploads/${folder}/${newFileName}`

  await sharp(filePath).jpeg().toFile(destinationFile)

  return { filename: file.fieldname, destination: urlImage }
}

export const unlinkAsync = promisify(fs.unlink)

export const processAndSaveAudio = async (file: Express.Multer.File) => {
  // find folder for type images
  const fileType = 'AUDIO'
  let folder = 'others'

  const foundFolder = Object.keys(FolderUpload).filter((type) => type == fileType)
  if (foundFolder && foundFolder.length == 1) folder = FolderUpload[foundFolder[0] as keyof typeof FolderUpload]

  // create folder if not exist
  ensureFolderExists(`uploads/${folder}`)

  const filePath = path.resolve(file.path)
  const destinationPath = path.resolve('uploads', folder)
  const newFileName = `${Date.now()}-${path.parse(file.originalname).name}.mp3`
  const destinationFile = path.join(destinationPath, newFileName)

  // Use local network IP or emulator addresses
  const hostUrl = env.HOST_URL?.replace('localhost', '10.0.2.2') || 'http://10.0.2.2:8081'
  const urlImage = `${hostUrl}/uploads/${folder}/${newFileName}`

  await fs.promises.copyFile(filePath, destinationFile)

  return { filename: file.fieldname, destination: urlImage }
}

export const uploadAudio = async (file: Express.Multer.File) => {
  // convert to array
  const _file = await processAndSaveAudio(file)

  // delete temp files
  // unlinkAsync(file.path)

  return _file
}

// Middleware upload
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5Mb
