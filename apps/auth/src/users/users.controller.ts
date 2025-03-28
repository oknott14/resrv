import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDocument } from './models/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestUser } from '../request-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@RequestUser() user: UserDocument): Promise<UserDocument> {
    return user;
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @RequestUser() user: UserDocument,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user._id, updateUserDto);
  }

  @Delete('all')
  async delete() {
    const users = await this.usersService.findAll();

    console.log(users);
    return users[0];
  }
}
