import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from './users/models/users.schema';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

export const RequestUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
