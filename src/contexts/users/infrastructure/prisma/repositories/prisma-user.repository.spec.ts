import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaService } from 'src/common/infrastructure/prisma/prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { faker } from '@faker-js/faker';
import { User } from 'src/contexts/users/domain/user';

jest.mock('../mappers/prisma-user.mapper');

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    repository = new PrismaUserRepository(prisma);
    jest.clearAllMocks();
  });

  it('should return a domain user if found', async () => {
    const fakeDbUser = {
      id: faker.string.uuid(),
      username: faker.internet.username(),
      createdAt: faker.date.past(),
    };

    const domainUser = new User(fakeDbUser);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeDbUser);
    (PrismaUserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);

    const result = await repository.findById(fakeDbUser.id);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: fakeDbUser.id },
    });

    expect(PrismaUserMapper.toDomain).toHaveBeenCalledWith(fakeDbUser);
    expect(result).toEqual(domainUser);
  });

  it('should return null if user is not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await repository.findById(faker.string.uuid());

    expect(result).toBeNull();
  });

  it('should throw if Prisma throws', async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error('DB exploded'),
    );

    await expect(repository.findById(faker.string.uuid())).rejects.toThrow(
      'DB exploded',
    );
  });
});
