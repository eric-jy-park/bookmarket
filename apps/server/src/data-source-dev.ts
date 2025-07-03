import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables from .env file
config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,

  entities: ['./src/**/*.entity.ts'], // Use TypeScript files directly
  synchronize: false,
  migrations: ['./src/migrations/**/*.ts'], // Use TypeScript migrations
  migrationsTableName: 'migrations',
  migrationsRun: true,
});
