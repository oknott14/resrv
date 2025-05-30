import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  // Allow communication between microservices using tcp
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.getOrThrow<string>('HOST'),
      port: configService.getOrThrow<number>('TCP_PORT'),
    },
  });

  // Parse all cookies and add them to the request
  app.use(cookieParser());

  // Validate request parameters and objects before reaching the controller
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Setup Logging
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
}
bootstrap();
