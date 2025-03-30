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
    .setDescription(
      `
    # Bookmarket API Documentation

    Welcome to the Bookmarket API, a comprehensive solution for managing bookmarks and categories.

    ## Features

    - Create, read, update, and delete bookmarks
    - Organize bookmarks with categories
    - User authentication with multiple providers (Email, Google, GitHub)
    - Access control based on user authentication

    ## Authentication

    This API uses cookie-based authentication:

    1. Send credentials to the /authentication/signin endpoint
    2. The server will set HTTP-only cookies in the response
    3. Subsequent requests will automatically include these cookies
    4. No explicit Authorization header is needed

    Most endpoints require authentication through this cookie mechanism.

    The API supports:
    - Email/password authentication
    - Google OAuth
    - GitHub OAuth
    `,
    )
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Bookmarket', 'General information about the application')
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
    .addServer('http://localhost:8000', 'Local development server')
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
