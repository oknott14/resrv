import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  // Parse cookies and add them to the request
  app.use(cookieParser());

  // Validate request objects before they reach the controller
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Setup Logging
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
