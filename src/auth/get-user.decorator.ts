import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../users/user.entity';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
