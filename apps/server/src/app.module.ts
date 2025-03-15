import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
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
      migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
      migrationsTableName: 'migrations',
      migrationsRun: true,
    }),
    IamModule,
    CategoriesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  controllers: [],
})
export class AppModule {}
