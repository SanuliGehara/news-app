// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   });
//   await app.listen(process.env.PORT || 4000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// This is the correct structure for Vercel
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // IMPORTANT: Update this for your LIVE frontend URL
  app.enableCors({
    origin: 'https://news-app-sigma-rose.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // DO NOT USE app.listen() for Vercel
  await app.init(); 
  return app.getHttpAdapter().getInstance();
}