import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm'
  import { Topic } from './topic.entity'
  import { Word } from './word.entity'
  
  @Entity('word_topic')
  @Index(['word', 'topic'], { unique: true })
  export class WordTopic extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column('int') 
    wordId: number
  
    @Column('int') 
    topicId: number
  
    @ManyToOne(() => Word, (word) => word.wordTopics, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'wordId' })
    word?: Word
  
    @ManyToOne(() => Topic, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'topicId' })
    topic?: Topic
  
    @DeleteDateColumn()
    deletedAt?: Date
  
    @CreateDateColumn()
    createdAt?: Date
  
    @UpdateDateColumn()
    updatedAt?: Date
  }