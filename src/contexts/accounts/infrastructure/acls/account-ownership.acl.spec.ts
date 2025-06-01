import { AccountOwnershipAcl } from './account-ownership.acl';
import { AccountRepository } from '../../application/ports/account.repository';
import { faker } from '@faker-js/faker';
import { Account } from '../../domain/account';

describe('AccountOwnershipAcl', () => {
  let acl: AccountOwnershipAcl;
  let accountRepository: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    accountRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<AccountRepository>;

    acl = new AccountOwnershipAcl(accountRepository);
  });

  it('should return true if account belongs to user', async () => {
    const userId = faker.string.uuid();
    const accountId = faker.string.uuid();

    const account = new Account({
      id: accountId,
      userId,
      balanceInCents: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    accountRepository.findById.mockResolvedValue(account);

    const result = await acl.accountBelongsToUser({ accountId, userId });

    expect(result).toBe(true);
    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
  });

  it('should return false if account does not belong to user', async () => {
    const correctUserId = faker.string.uuid();
    const wrongUserId = faker.string.uuid();
    const accountId = faker.string.uuid();

    const account = new Account({
      id: accountId,
      userId: correctUserId,
      balanceInCents: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    accountRepository.findById.mockResolvedValue(account);

    const result = await acl.accountBelongsToUser({
      accountId,
      userId: wrongUserId,
    });

    expect(result).toBe(false);
  });

  it('should return false if account does not exist', async () => {
    const accountId = faker.string.uuid();
    const userId = faker.string.uuid();

    accountRepository.findById.mockResolvedValue(null);

    const result = await acl.accountBelongsToUser({ accountId, userId });

    expect(result).toBe(false);
  });
});
