import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  SetMetadata,
  Injectable,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IS_PUBLIC_KEY } from './constants';

import { SignUserPayload } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // constructor(private reflector: Reflector) {
  //   super();
  // }
  // canActivate(context: ExecutionContext) {
  //   const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);
  //   if (isPublic) {
  //     return true;
  //   }
  //   return super.canActivate(context);
  // }
}

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): SignUserPayload => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
