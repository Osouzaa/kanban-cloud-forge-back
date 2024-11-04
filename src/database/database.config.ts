import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { env } from 'src/env'
import { User } from './entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class DataBaseModule { }
