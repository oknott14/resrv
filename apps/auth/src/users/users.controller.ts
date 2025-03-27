import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { BaseController } from '@app/common';
import { UserDocument } from './models/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController extends BaseController<
  UserDocument,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }
}
