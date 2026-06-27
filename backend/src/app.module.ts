import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BotModule } from './bot/bot.module';
import { JemaatModule } from './jemaat/jemaat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3', // <-- ganti di sini
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    BotModule,
    JemaatModule
  ],
})
export class AppModule {}