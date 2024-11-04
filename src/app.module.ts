import { Module } from '@nestjs/common'

import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './database/database.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, DataBaseModule],
})
export class AppModule { }
