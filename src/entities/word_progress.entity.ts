import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator'
import {
    BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { IntervalLevel, MasteryLevel, MasteryToIntervalMap } from '~/constants/wordProgress'
import { User } from './user.entity'
import { Word } from './word.entity'

@Entity()
export class WordProgress extends BaseEntity{
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  @IsEnum(MasteryLevel, {message: 'Invalid mastery level'})
  mastery_level?: MasteryLevel

  @Column('int')
  @IsEnum(IntervalLevel)
  @IsOptional()
  interval?: number

  //default: 2.5
  @Column('double', {default: 2.5})
  ease_factor: number

  @Column('datetime', {default: null} )
  @IsDate({message: 'Invalid next review date'})
  next_review_date!: Date;

  @ManyToOne(() => User, (user) => user.wordProgresses)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Word, (word) => word.wordProgresses)
  @JoinColumn({name: 'wordId'})
  word: Word;

  @UpdateDateColumn()
  updatedAt?: Date

  @CreateDateColumn()
  createAt?: Date

  static createWordProgress = ({mastery_level, user, word} : WordProgress) =>
  {
    const newWordProgress = new WordProgress ()

    newWordProgress.user = user;
    newWordProgress.word = word;
    
    if(mastery_level !== undefined)
    {
      newWordProgress.mastery_level = mastery_level;
      newWordProgress.interval = MasteryToIntervalMap[mastery_level];
    }

    return newWordProgress;
  }

  static updateWordProgress = ( wordProgress: WordProgress, {mastery_level, ease_factor} : WordProgress) => {
    if(mastery_level !== undefined)
    {
      wordProgress.mastery_level = mastery_level;
      wordProgress.interval = MasteryToIntervalMap[mastery_level];
    }
    if(ease_factor !== undefined) wordProgress.ease_factor = ease_factor;

    return wordProgress;
  }
}