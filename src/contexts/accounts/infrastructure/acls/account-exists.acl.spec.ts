import { AccountExistsAcl } from './account-exists.acl';
import { AccountRepository } from '../../application/ports/account.repository';
import { faker } from '@faker-js/faker';
import { Account } from '../../domain/account';

describe('AccountExistsAcl', () => {
  let acl: AccountExistsAcl;
  let accountRepository: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    accountRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<AccountRepository>;

    acl = new AccountExistsAcl(accountRepository);
  });

  it('should return true if account exists', async () => {
    const mockAccount = new Account({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      balanceInCents: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    accountRepository.findById.mockResolvedValue(mockAccount);

    const result = await acl.accountExists(mockAccount.id);

    expect(result).toBe(true);
    expect(accountRepository.findById).toHaveBeenCalledWith(mockAccount.id);
  });

  it('should return false if account does not exist', async () => {
    const accountId = faker.string.uuid();

    accountRepository.findById.mockResolvedValue(null);

    const result = await acl.accountExists(accountId);

    expect(result).toBe(false);
    expect(accountRepository.findById).toHaveBeenCalledWith(accountId);
  });
});
