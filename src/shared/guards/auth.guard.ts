import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../../common/types/auth-user.types';
import { UserExistsPort } from '../contracts/user-exists.port';
import { Assert } from 'src/common/util/assert';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userExistsPort: UserExistsPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const userId = Assert.notEmpty(
      request.headers['x-user-id'] as string | undefined,
      new UnauthorizedException('Missing or invalid X-User-Id header'),
    );

    const userExists = await this.userExistsPort.userExists(userId);

    Assert.isTrue(userExists, new UnauthorizedException('User not found'));

    request['user'] = {
      sub: userId,
    } as AuthUser;

    return true;
  }
}
