import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PlatformLoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PlatformLoggerService(),
  });

  // @SETUP Update CORS origin for production
  // Set CORS_ORIGIN env var to your frontend URL (e.g., https://yourdomain.com)
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Full Stack Template API')
    .setVersion('1.0')
    .build();

  // @SETUP Consider disabling or protecting Swagger in production
  // Either remove this block for prod, or add authentication middleware
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: '/api-json',
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
