import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const authorization =
      GqlExecutionContext.create(ctx).getContext().req.headers.authorization;

    const temp = authorization.split(' ');

    if (temp.length === 2 && temp[1]) {
      return temp[1];
    }

    return '';
  },
);
