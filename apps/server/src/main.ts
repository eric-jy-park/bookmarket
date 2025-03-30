import './instrument';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  app.enableCors();
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Bookmarket API Docs')
    .setVersion('1.0')
    .addTag('Bookmarks', 'Operations related to bookmarks management')
    .addTag('Categories', 'Operations related to bookmark categories')
    .addTag('Users', 'User management operations')
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('GoogleAuthentication', 'Google OAuth authentication')
    .addTag('GithubAuthentication', 'GitHub OAuth authentication')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'Authentication cookie set after successful login',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Add custom UI options
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      displayRequestDuration: true,
      showExtensions: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      deepLinking: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Bookmarket API Documentation',
  });

  await app.listen(8000);
}
bootstrap();
