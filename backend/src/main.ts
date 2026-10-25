import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 
    'https://frontend-lilac-iota-h7ro0u2zql.vercel.app',],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
  }),
);

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port);

  console.log('KUSANYA API running on port ${port}');
}
bootstrap();

  // app.enableCors({
  //   // origin: 'http://localhost:3001',
  //   origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
  // });