import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Folder } from './folder.entity'
import { User } from './user.entity'

@Entity()
export class ShareFolder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Folder)
  folder: Folder
}
