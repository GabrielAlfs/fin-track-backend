import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserExistsPort } from '../contracts/user-exists.port';
import { Request } from 'express';
import { randomUUID } from 'crypto';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userExistsPort: UserExistsPort;

  beforeEach(() => {
    userExistsPort = {
      userExists: jest.fn(),
    };
    guard = new AuthGuard(userExistsPort);
  });

  const mockExecutionContext = (
    userId: string | undefined,
  ): ExecutionContext => {
    const request = {
      headers: userId ? { 'x-user-id': userId } : {},
    } as Partial<Request>;

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow access when user exists', async () => {
    const userId = randomUUID();
    (userExistsPort.userExists as jest.Mock).mockResolvedValue(true);

    const context = mockExecutionContext(userId);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);

    const req = context.switchToHttp().getRequest();
    expect(req['user']).toEqual({ sub: userId });
  });

  it('should throw if x-user-id header is missing', async () => {
    const context = mockExecutionContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Missing or invalid X-User-Id header'),
    );
  });

  it('should throw if user does not exist', async () => {
    const userId = randomUUID();
    (userExistsPort.userExists as jest.Mock).mockResolvedValue(false);

    const context = mockExecutionContext(userId);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('User not found'),
    );
  });
});
