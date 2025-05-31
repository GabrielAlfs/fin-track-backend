import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../../common/types/auth-user.types';
import { Assert } from 'src/common/util/assert';
import { AccountOwnershipPort } from '../contracts/account-ownership.port';
import { AuthSelectedAccount } from 'src/common/types/auth-selected-account.types';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private readonly accountOwnershipPort: AccountOwnershipPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = Assert.notEmpty(
      request['user'] as AuthUser | undefined,
      new UnauthorizedException('User not authenticated'),
    );

    const accountId = Assert.notEmpty(
      request.headers['x-account-id'] as string | undefined,
      new UnauthorizedException('Missing or invalid X-Account-Id header'),
    );

    const accountBelongsToUser =
      await this.accountOwnershipPort.accountBelongsToUser({
        accountId,
        userId: user.sub,
      });

    Assert.isTrue(
      accountBelongsToUser,
      new UnauthorizedException(
        'The provided account does not belong to the current user',
      ),
    );

    request['userAccount'] = {
      accountId,
    } as AuthSelectedAccount;

    return true;
  }
}
