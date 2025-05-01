import {
    BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import {
  DEFAULT_EASE_FACTOR,
  DEFAULT_MASTERY_LEVEL,
  DEFAULT_REVIEW_COUNT,
  INTERVAL_BASE,
  MULTI_BASE,
  WORD_MASTERY_LEVEL
} from '~/constants/userProgress'
import { User } from './user.entity'
import { Word } from './word.entity'
import { now } from 'lodash'

@Entity()
export class WordProgress extends BaseEntity{
  @PrimaryGeneratedColumn()
  id?: number

  @Column('int', { default: WORD_MASTERY_LEVEL.NEW })
  masteryLevel: WORD_MASTERY_LEVEL

  @Column('int', { default: 0 })
  easeFactor: number

  @Column('int')
  reviewCount!: number

  @Column('datetime')
  nextReviewDate!: Date

  @ManyToOne(() => User, (user) => user.wordProgresses)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Word, (word) => word.wordProgresses)
  @JoinColumn({name: 'wordId'})
  word: Word;

  @UpdateDateColumn()
  updatedAt?: Date

  @CreateDateColumn()
  createdAt?: Date 

  static createWordProgress = ({
    masteryLevel,
    userId,
    wordId,
    easeFactor,
    reviewedDate = new Date(now()),
    reviewCount
  }: {
    masteryLevel?: WORD_MASTERY_LEVEL
    userId: number
    wordId: number
    easeFactor?: number
    reviewedDate?: Date
    reviewCount?: number
  }) => {
    const newWordProgress = new WordProgress()

    newWordProgress.user = { id: userId } as User
    newWordProgress.word = { id: wordId } as Word
    newWordProgress.masteryLevel = masteryLevel || DEFAULT_MASTERY_LEVEL
    newWordProgress.easeFactor = easeFactor || DEFAULT_EASE_FACTOR
    newWordProgress.nextReviewDate = WordProgress.calculateReviewDate(newWordProgress.easeFactor, reviewedDate)
    newWordProgress.reviewCount = reviewCount || DEFAULT_REVIEW_COUNT

    return newWordProgress
  }

  static calculateReviewDate = (easeFactor: number, reviewedDate: Date, masteryLevel?: WORD_MASTERY_LEVEL) => {
    const OneHour = 60 * 60 * 1000
    const spaceReview = INTERVAL_BASE * Math.pow(MULTI_BASE, easeFactor) * OneHour // Convert days to milliseconds
    const newDate = new Date(reviewedDate)
    newDate.setTime(newDate.getTime() + spaceReview)
    return newDate
  }

  static updateWordProgress = (
    wordProgress: WordProgress,
    { easeFactor, masteryLevel, nextReviewDate, reviewCount }: WordProgress
  ) => {
    if (easeFactor) wordProgress.easeFactor = easeFactor
    if (masteryLevel) wordProgress.masteryLevel = masteryLevel
    if (nextReviewDate) wordProgress.nextReviewDate = nextReviewDate
    if (reviewCount) wordProgress.reviewCount = reviewCount

    return wordProgress
  }
}