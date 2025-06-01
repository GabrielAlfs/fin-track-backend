import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsFacade } from '../../application/transactions.facade';
import { TransactionViewModel } from './viewmodels/transaction.view-model';
import { TransactionType } from '../../domain/transaction';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PerformRefundDto } from './dto/perform-refund.dto';
import { ListTransactionsDto } from './dto/list-transactions.dto';
import { faker } from '@faker-js/faker';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccountGuard } from 'src/shared/guards/account.guard';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let facade: TransactionsFacade;
  let viewModel: TransactionViewModel;

  const mockTransaction = {
    id: faker.string.uuid(),
    amount: faker.number.float({ min: 10, max: 1000 }),
    type: TransactionType.INCOME,
    description: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
  };

  const mockHTTPResponse = {
    id: mockTransaction.id,
    amount: mockTransaction.amount,
    type: 'income',
    description: mockTransaction.description,
    createdAt: mockTransaction.createdAt,
  };

  const mockPaginationQuery: ListTransactionsDto = {
    limit: 10,
    page: 1,
    order: 'desc',
    sort: 'createdAt',
  };

  class MockGuard {
    canActivate() {
      return true;
    }
  }

  beforeEach(async () => {
    Reflect.deleteMetadata('__guards__', TransactionsController);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsFacade,
          useValue: {
            list: jest.fn().mockResolvedValue({
              items: [mockTransaction],
              total: 1,
              page: 1,
              pageSize: 10,
            }),
            create: jest.fn().mockResolvedValue(mockTransaction),
            refund: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
        {
          provide: TransactionViewModel,
          useValue: {
            toHTTP: jest.fn().mockReturnValue(mockHTTPResponse),
          },
        },
        {
          provide: AuthGuard,
          useClass: MockGuard,
        },
        {
          provide: AccountGuard,
          useClass: MockGuard,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    facade = module.get<TransactionsFacade>(TransactionsFacade);
    viewModel = module.get<TransactionViewModel>(TransactionViewModel);
  });

  describe('listTransactions', () => {
    it('should map and forward type correctly when provided', async () => {
      const dto: ListTransactionsDto = {
        type: 'income',
        ...mockPaginationQuery,
      };

      const accountId = faker.string.uuid();
      const result = await controller.listTransactions({ accountId }, dto);

      expect(facade.list).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId,
          type: TransactionType.INCOME,
        }),
      );

      expect(viewModel.toHTTP).toHaveBeenCalledWith(mockTransaction);

      expect(result.items).toEqual([mockHTTPResponse]);
    });

    it('should not set type when not provided', async () => {
      const dto: ListTransactionsDto = {
        ...mockPaginationQuery,
      };
      const accountId = faker.string.uuid();

      await controller.listTransactions({ accountId }, dto);

      expect(facade.list).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId,
          type: undefined,
        }),
      );
    });
  });

  describe('createIncome', () => {
    it('should create income with correct type', async () => {
      const dto: CreateTransactionDto = {
        amount: faker.number.float({ min: 100, max: 500 }),
        description: faker.lorem.words(5),
      };
      const accountId = faker.string.uuid();

      const result = await controller.createIncome({ accountId }, dto);

      expect(facade.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId,
          ...dto,
          type: TransactionType.INCOME,
        }),
      );

      expect(viewModel.toHTTP).toHaveBeenCalledWith(mockTransaction);

      expect(result).toEqual(mockHTTPResponse);
    });
  });

  describe('createExpense', () => {
    it('should create expense with correct type', async () => {
      const dto: CreateTransactionDto = {
        amount: faker.number.float({ min: 10, max: 300 }),
        description: faker.commerce.productDescription(),
      };
      const accountId = faker.string.uuid();

      const result = await controller.createExpense({ accountId }, dto);

      expect(facade.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId,
          ...dto,
          type: TransactionType.EXPENSE,
        }),
      );

      expect(viewModel.toHTTP).toHaveBeenCalledWith(mockTransaction);

      expect(result).toEqual(mockHTTPResponse);
    });
  });

  describe('createRefund', () => {
    it('should call refund with correct command', async () => {
      const transactionId = faker.string.uuid();
      const accountId = faker.string.uuid();
      const dto: PerformRefundDto = {
        description: faker.lorem.sentence(),
      };

      const result = await controller.createRefund(
        { accountId },
        transactionId,
        dto,
      );

      expect(facade.refund).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId,
          transactionId,
          description: dto.description,
        }),
      );

      expect(viewModel.toHTTP).toHaveBeenCalledWith(mockTransaction);

      expect(result).toEqual(mockHTTPResponse);
    });
  });
});
