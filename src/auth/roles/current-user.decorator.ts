import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../interfaces/auth-user.interface';

type RequestWithUser = Request & {
  user: AuthUser;
};

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) return null;

    // 🔥 si pedís una propiedad específica
    if (data) {
      return user[data];
    }

    // 🔥 si querés todo el user
    return user;
  },
);
