import { FindOptionsOrder } from 'typeorm'
import { Folder } from '~/entities/folder.entity'

export interface folderQueryReq {
  page?: number
  limit?: number
  name?: string
  sort?: FindOptionsOrder<Folder>
}
