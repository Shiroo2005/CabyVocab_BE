import { FindOptionsOrder } from 'typeorm'
import { Folder } from '~/entities/folder.entity'

export interface postQueryReq {
  page?: number
  limit?: number
  sort?: FindOptionsOrder<Folder>
  ownerId?: number
  tag?: string[]
  content?: string
}
