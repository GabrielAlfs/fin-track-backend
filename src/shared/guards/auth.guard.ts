import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../../common/types/auth-user.types';
import { UserExistsPort } from '../contracts/user-exists.port';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userExistsPort: UserExistsPort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.headers['x-user-id'];

    if (typeof userId !== 'string') {
      throw new UnauthorizedException('Missing or invalid user-id header');
    }

    const userExists = await this.userExistsPort.userExists(userId);

    if (!userExists) {
      throw new UnauthorizedException('User not found');
    }

    request['user'] = {
      sub: userId,
    } as AuthUser;

    return true;
  }
}
