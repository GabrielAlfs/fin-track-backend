import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SelectedAccount = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.userAccount;
  },
);
