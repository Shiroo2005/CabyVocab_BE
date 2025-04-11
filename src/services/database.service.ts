import { config } from 'dotenv'
import { env } from 'process'
import { parseInt } from 'lodash'
import * as mysql2 from 'mysql2'
import { DataSource, ObjectLiteral, Repository } from 'typeorm'
import { User } from '~/entities/user.entity'
import { Role } from '~/entities/role.entitity'
import { Token } from '~/entities/token.entity'
import { customLogger } from '~/utils/log'
import { seedInitialData } from '~/utils/seed'
console.log('DatabaseService loaded')

config()

export class DatabaseService {
  public appDataSource
  private static instance: DatabaseService
  constructor() {
    console.log('DatabaseService loaded')
    this.appDataSource = new DataSource({
      type: 'mysql',
      driver: mysql2,
      database: env.DB_NAME as string,
      username: env.DB_USERNAME as string,
      password: env.DB_PASSWORD as string,
      host: env.DB_HOST as string,
      port: parseInt(env.DB_PORT as string),
      entities: [User, Role, Token],
      logging: 'all',
      logger: customLogger,
      synchronize: true
      // logger: LogCustomize
    })
  }

  async connect() {
    try {
      await this.appDataSource.initialize()
      console.log('info', 'Database connected successfully ✅')
    } catch (error) {
      console.log(`Unable to connect to the database: ${(error as Error).message}`)
    }
  }

  async getRepository<T extends ObjectLiteral>(entity: { new (): T }): Promise<Repository<T>> {
    if (!this.appDataSource.isInitialized) await this.connect()
    return this.appDataSource.getRepository(entity)
  }

  async syncDB() {
    try {
      await this.appDataSource.synchronize()
      console.log('info', 'Database synchronized (alter mode) 🔄')

      // seed data
      await seedInitialData()
      // seedData()
    } catch (error) {
      console.log((error as Error).message, (error as Error).stack)
    }
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async init() {
    await this.connect()
    await this.syncDB()
  }
}
