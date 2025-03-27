import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseService } from '@app/common';
import { UserDocument } from './models/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService extends BaseService<
  UserDocument,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly usersRepository: UsersRepository) {
    super(usersRepository);
  }
}
