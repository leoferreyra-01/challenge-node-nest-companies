import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Companies API')
    .setDescription('API for managing companies and transactions')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API key for authentication - Required for all endpoints',
      },
      'X-API-Key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Add global security requirement to all endpoints
  document.security = [{ 'X-API-Key': [] }];

  if (document.paths) {
    Object.keys(document.paths).forEach((path) => {
      Object.keys(document.paths[path]).forEach((method) => {
        if (document.paths[path][method]) {
          // Set security requirement without duplicates
          document.paths[path][method].security = [{ 'X-API-Key': [] }];
        }
      });
    });
  }

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
    },
    customSiteTitle: 'Companies API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em; }
    `,
  });

  await app.listen(3000);
}
bootstrap();
