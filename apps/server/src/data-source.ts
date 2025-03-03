import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables from .env file
config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  // Use hardcoded relative paths for entity discovery
  entities: ['./dist/**/*.entity.js'],
  // FIXME: Should be set to false on prod
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: ['./dist/migrations/**/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
});
