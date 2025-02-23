import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(cookieParser());
  app.enableCors({
    origin: ['*'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  const port = 8000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}

// Add proper error handling for bootstrap
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
