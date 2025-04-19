import { IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  In,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { WordPosition, WordRank } from '~/constants/word'
import { Topic } from './topic.entity'
import { WordProgress } from './word_progress.entity'

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

  @Column('varchar', { default: WordRank.A1 })
  @IsEnum(WordRank, { message: 'rank must be in enum WordRank' })
  @IsOptional()
  rank?: WordRank

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  @Length(1, 255, { message: 'Example must be between 1 and 255 chars long.' })
  example?: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  @Length(1, 255, { message: 'Translate example must be between 1 and 255 characters long.' })
  translateExample?: string

  //foreign key
  @ManyToMany(() => Topic, (topic) => topic.words)
  @JoinTable({ name: 'word_topic' })
  topics?: Topic[]

  @OneToMany(() => WordProgress, (wordProgress) => wordProgress.word)
  wordProgresses: WordProgress[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static createWord = ({
    content,
    meaning,
    pronunciation,
    audio,
    image,
    rank,
    position,
    example,
    translateExample
  }: Word) => {
    const newWord = new Word()
    newWord.content = content
    newWord.position = position
    newWord.pronunciation = pronunciation
    newWord.meaning = meaning
    newWord.audio = audio
    newWord.image = image
    newWord.rank = rank
    newWord.example = example
    newWord.translateExample = translateExample

    return newWord
  }

  // dùng Partial
  static updateWord = async (
    word: Word,
    {
      content,
      meaning,
      pronunciation,
      audio,
      image,
      rank,
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
      rank?: WordRank
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
    if (rank) word.rank = rank
    if (position) word.position = position
    if (example) word.example = example
    if (translateExample) word.translateExample = translateExample

    if (topicIds && topicIds.length > 0) {
      const topics = await Topic.find({
        where: { id: In(topicIds)} 
      });
      word.topics = topics;  // Associate the topics with the word
    }
    await word.save()
    return word
  }
}