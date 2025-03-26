import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { configSchema } from './config.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: configSchema,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
