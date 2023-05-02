import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class OAuthsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.headers.authorization) {
      return false;
    }
    ctx.user = await this.validateToken(ctx.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    return { _id: 'xxxx' };
  }
}
