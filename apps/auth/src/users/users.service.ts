import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseService } from '@app/common';
import { UserDocument } from './models/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService extends BaseService<
  UserDocument,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly usersRepository: UsersRepository) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    await this.validateUserEmail(createUserDto.email);
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.usersRepository.create(createUserDto);
  }

  private async validateUserEmail(email: string) {
    try {
      this.usersRepository.findOne({ email });

      throw new UnprocessableEntityException(
        `A user with the email ${email} already exists`,
      );
    } catch (err) {
      return;
    }
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({ email }).catch();
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    return user;
  }
}
