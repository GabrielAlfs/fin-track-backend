import { AccountGuard } from './account.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AccountOwnershipPort } from '../contracts/account-ownership.port';
import { Request } from 'express';

describe('AccountGuard', () => {
  let guard: AccountGuard;
  let accountOwnershipPort: AccountOwnershipPort;

  beforeEach(() => {
    accountOwnershipPort = {
      accountBelongsToUser: jest.fn(),
    };
    guard = new AccountGuard(accountOwnershipPort);
  });

  const mockExecutionContext = (
    user: any,
    accountId: string | undefined,
  ): ExecutionContext => {
    const request = {
      headers: accountId ? { 'x-account-id': accountId } : {},
      user,
    } as Partial<Request>;

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow access when user is authenticated and owns the account', async () => {
    const user = { sub: 'user-1' };
    const accountId = 'account-1';

    (accountOwnershipPort.accountBelongsToUser as jest.Mock).mockResolvedValue(
      true,
    );

    const context = mockExecutionContext(user, accountId);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    const req = context.switchToHttp().getRequest();
    expect(req['userAccount']).toEqual({ accountId });
  });

  it('should throw if user is not authenticated', async () => {
    const context = mockExecutionContext(undefined, 'account-1');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('User not authenticated'),
    );
  });

  it('should throw if x-account-id header is missing', async () => {
    const context = mockExecutionContext({ sub: 'user-1' }, undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Missing or invalid X-Account-Id header'),
    );
  });

  it('should throw if account does not belong to user', async () => {
    (accountOwnershipPort.accountBelongsToUser as jest.Mock).mockResolvedValue(
      false,
    );

    const context = mockExecutionContext({ sub: 'user-1' }, 'account-1');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException(
        'The provided account does not belong to the current user',
      ),
    );
  });
});
