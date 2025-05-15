import { IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { WordPosition } from '~/constants/word'
import { WordProgress } from './wordProgress.entity'
import { WordTopic } from './wordTopic.entity'

@Entity()
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  @IsNotEmpty({ message: 'Content must be a not empty string!' })
  @Length(1, 255, { message: 'Content must be between 1 and 255 chars long!' })
  content!: string

  @Column('varchar')
  @IsNotEmpty({ message: 'Pronunciation must be a not empty string!' })
  @Length(1, 255, { message: 'Pronunciation must be between 1 and 255 chars long!' })
  pronunciation!: string

  @Column('varchar', { default: WordPosition.OTHERS })
  @IsOptional()
  @IsEnum(WordPosition, { message: 'position must be in enum WordPosition' })
  position?: WordPosition

  @Column('varchar')
  @IsNotEmpty({ message: 'Meaning must be a not empty string!' })
  @Length(1, 255, { message: 'Content must be between 1 and 255 chars long!' })
  meaning!: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  audio?: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  image?: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  @Length(1, 255, { message: 'Example must be between 1 and 255 chars long.' })
  example?: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  @Length(1, 255, { message: 'Translate example must be between 1 and 255 characters long.' })
  translateExample?: string

  //foreign key
  @OneToMany(() => WordProgress, (wordProgress) => wordProgress.word)
  wordProgresses: WordProgress[]

  @OneToMany(() => WordTopic, (wordTopic) => wordTopic.word)
  wordTopics?: WordTopic[]

  // @ManyToMany(() => Topic)
  // @JoinTable()
  // topics: Topic[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static createWord = async ({
    content,
    meaning,
    pronunciation,
    audio,
    image,
    position,
    example,
    translateExample,
    topicIds
  }: Word & { topicIds?: number[] }) => {
    const newWord = new Word()
    newWord.content = content
    newWord.position = position
    newWord.pronunciation = pronunciation
    newWord.meaning = meaning
    newWord.audio = audio
    newWord.image = image
    newWord.example = example
    newWord.translateExample = translateExample

    // Save the word first to get an ID
    await newWord.save()

    // Create word-topic relationships if topicIds are provided
    if (topicIds && topicIds.length > 0) {
      // Create new relationships - using the same approach as updateWord
      for (const topicId of topicIds) {
        const wordTopic = new WordTopic()
        wordTopic.wordId = newWord.id as number
        wordTopic.topicId = topicId
        await wordTopic.save()
      }
    }

    return newWord
  }

  static updateWord = async (
    word: Word,
    {
      content,
      meaning,
      pronunciation,
      audio,
      image,
      position,
      example,
      translateExample,
      topicIds
    }: {
      content?: string
      pronunciation?: string
      meaning?: string
      position?: WordPosition
      audio?: string
      image?: string
      example?: string
      translateExample?: string
      topicIds: number[]
    }
  ) => {
    if (content) word.content = content
    if (meaning) word.meaning = meaning
    if (pronunciation) word.pronunciation = pronunciation
    if (audio) word.audio = audio
    if (image) word.image = image
    if (position) word.position = position
    if (example) word.example = example
    if (translateExample) word.translateExample = translateExample

    if (topicIds && topicIds.length > 0) {
      // Remove existing relationships
      await WordTopic.delete({ wordId: word.id })

      // Create new relationships
      for (const topicId of topicIds) {
        const wordTopic = new WordTopic()
        wordTopic.wordId = word.id as number
        wordTopic.topicId = topicId
        await wordTopic.save()
      }
    }
    await word.save()
    return word
  }

  static allowSortList = [
    'id',
    'content',
    'pronunciation',
    'position',
    'meaning',
    'rank',
    'example',
    'translateExample'
  ]
}
