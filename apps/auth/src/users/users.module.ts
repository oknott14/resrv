import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UsersModelDef } from './models/users.schema';
import { UsersRepository } from './users.repository';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([UsersModelDef]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
