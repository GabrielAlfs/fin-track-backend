import { PrismaAccountRepository } from './prisma-account.repository';
import { PrismaService } from 'src/common/infrastructure/prisma/prisma.service';
import { PrismaAccountMapper } from '../mappers/prisma-account.mapper';
import { faker } from '@faker-js/faker';
import { Account } from 'src/contexts/accounts/domain/account';

jest.mock('../mappers/prisma-account.mapper');

describe('PrismaAccountRepository', () => {
  let repository: PrismaAccountRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      account: {
        findUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    repository = new PrismaAccountRepository(prisma);
    jest.clearAllMocks();
  });

  it('should return a domain account if found', async () => {
    const fakeDbAccount = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      balanceInCents: 12000,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    const domainAccount = new Account({ ...fakeDbAccount });

    (prisma.account.findUnique as jest.Mock).mockResolvedValue(fakeDbAccount);
    (PrismaAccountMapper.toDomain as jest.Mock).mockReturnValue(domainAccount);

    const result = await repository.findById(fakeDbAccount.id);

    expect(prisma.account.findUnique).toHaveBeenCalledWith({
      where: { id: fakeDbAccount.id },
    });

    expect(PrismaAccountMapper.toDomain).toHaveBeenCalledWith(fakeDbAccount);
    expect(result).toEqual(domainAccount);
  });

  it('should return null if account is not found', async () => {
    (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await repository.findById(faker.string.uuid());

    expect(result).toBeNull();
  });

  it('should throw if Prisma throws', async () => {
    (prisma.account.findUnique as jest.Mock).mockRejectedValue(
      new Error('DB exploded'),
    );

    await expect(repository.findById(faker.string.uuid())).rejects.toThrow(
      'DB exploded',
    );
  });
});
