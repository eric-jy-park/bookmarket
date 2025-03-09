import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    BookmarksModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: true,
      autoLoadEntities: true,
      // FIXME: Should be set to false on prod
      synchronize: process.env.NODE_ENV !== 'production',
      // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      // migrationsTableName: 'migrations',
      // migrationsRun: true,
    }),
    IamModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
