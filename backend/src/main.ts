import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
  }),
);

  const port = Number(process.env.PORT ?? 3000);

  console.log(`KUSANYA API running BEFORE listening on port ${process.env.PORT ?? 3000}`);

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`KUSANYA API running on port ${process.env.PORT ?? 3000}`);
  console.log('2 KUSANYA API running on port ${port}');
}
bootstrap();

  // app.enableCors({
  //   // origin: 'http://localhost:3001',
  //   origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
  // });