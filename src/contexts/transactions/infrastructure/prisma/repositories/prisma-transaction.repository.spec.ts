import { Test, TestingModule } from '@nestjs/testing';
import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { PrismaService } from 'src/common/infrastructure/prisma/prisma.service';
import {
  TransactionType,
  Transaction,
} from 'src/contexts/transactions/domain/transaction';
import { PrismaTransactionMapper } from '../mappers/prisma-transaction.mapper';
import { faker } from '@faker-js/faker';

jest.mock('../mappers/prisma-transaction.mapper');

describe('PrismaTransactionRepository', () => {
  let repository: PrismaTransactionRepository;
  let prisma: jest.Mocked<PrismaService>;

  const createFakeTransaction = () => ({
    id: faker.string.uuid(),
    accountId: faker.string.uuid(),
    type: faker.helpers.arrayElement(['CREDIT', 'DEBIT']),
    amount: faker.finance.amount(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    description: faker.lorem.sentence(),
    originalTransactionId: null,
  });

  const createFakeDomainTransaction = (): Transaction =>
    new Transaction({
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      type: faker.helpers.arrayElement([
        TransactionType.INCOME,
        TransactionType.EXPENSE,
        TransactionType.REFUND,
      ]),
      amountInCents: Number(faker.finance.amount()),
      createdAt: faker.date.past(),
      description: faker.lorem.sentence(),
      originalTransactionId: null,
    });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaTransactionRepository,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn().mockResolvedValue(null),
              findFirst: jest.fn(),
              upsert: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(PrismaTransactionRepository);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('paginate', () => {
    it('should return paginated transactions', async () => {
      const rawTransactions = [
        createFakeTransaction(),
        createFakeTransaction(),
      ];
      const domainTransactions = [
        createFakeDomainTransaction(),
        createFakeDomainTransaction(),
      ];

      (prisma.$transaction as jest.Mock).mockResolvedValue([
        rawTransactions,
        2,
      ]);
      (PrismaTransactionMapper.toDomain as jest.Mock).mockImplementation(() =>
        domainTransactions.shift(),
      );

      const result = await repository.paginate({
        limit: 1,
        page: 1,
        sort: 'createdAt',
        order: 'asc',
        accountId: faker.string.uuid(),
        startDate: faker.date.past(),
        endDate: faker.date.recent(),
      });

      expect(result.items.length).toBe(2);
      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('findById', () => {
    it('should return a transaction if found', async () => {
      const raw = createFakeTransaction();
      const domain = createFakeDomainTransaction();

      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(raw);
      (PrismaTransactionMapper.toDomain as jest.Mock).mockReturnValue(domain);

      const result = await repository.findById(raw.id);

      expect(result).toEqual(domain);
    });

    it('should return null if transaction not found', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(faker.string.uuid());

      expect(result).toBeNull();
    });
  });

  describe('findRefundByOriginalId', () => {
    it('should return refund transaction', async () => {
      const raw = createFakeTransaction();
      const domain = createFakeDomainTransaction();

      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(raw);
      (PrismaTransactionMapper.toDomain as jest.Mock).mockReturnValue(domain);

      const result = await repository.findRefundByOriginalId(
        faker.string.uuid(),
      );

      expect(result).toEqual(domain);
    });

    it('should return null if refund not found', async () => {
      (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findRefundByOriginalId(
        faker.string.uuid(),
      );

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should upsert and return transaction', async () => {
      const domain = createFakeDomainTransaction();
      const raw = createFakeTransaction();

      (PrismaTransactionMapper.toPersistence as jest.Mock).mockReturnValue(raw);
      (prisma.transaction.upsert as jest.Mock).mockResolvedValue(raw);
      (PrismaTransactionMapper.toDomain as jest.Mock).mockReturnValue(domain);

      const result = await repository.save(domain);

      expect(prisma.transaction.upsert).toHaveBeenCalled();
      expect(result).toEqual(domain);
    });
  });
});
