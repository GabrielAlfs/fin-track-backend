import { ListTransactionsQueryHandler } from './list-transactions.query-handler';
import { ListTransactionsQuery } from './list-transactions.query';
import { TransactionRepository } from '../../ports/transaction.repository';
import {
  Transaction,
  TransactionType,
} from 'src/contexts/transactions/domain/transaction';
import { faker } from '@faker-js/faker';
import { Paginated } from 'src/common/interfaces/paginated.interface';

describe('ListTransactionsQueryHandler', () => {
  let handler: ListTransactionsQueryHandler;
  let transactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    transactionRepository = {
      paginate: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    handler = new ListTransactionsQueryHandler(transactionRepository);
  });

  const mockTransaction = (): Transaction =>
    new Transaction({
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      amountInCents: faker.number.int({ min: 100, max: 10000 }),
      type: faker.helpers.enumValue(TransactionType),
      description: faker.commerce.productDescription(),
      createdAt: faker.date.recent(),
    });

  it('should return paginated transactions from the repository', async () => {
    const transactions = Array.from({ length: 3 }, mockTransaction);

    const query: ListTransactionsQuery = {
      accountId: faker.string.uuid(),
      page: 1,
      limit: 10,
      order: 'desc',
      sort: 'createdAt',
      startDate: faker.date.past(),
      endDate: faker.date.recent(),
      type: undefined,
    };

    const paginatedResponse: Paginated<Transaction> = {
      items: transactions,
      totalPages: 1,
      page: 1,
      limit: 10,
      totalItems: 3,
    };

    transactionRepository.paginate.mockResolvedValue(paginatedResponse);

    const result = await handler.execute(query);

    expect(transactionRepository.paginate).toHaveBeenCalledWith({ ...query });
    expect(result).toEqual(paginatedResponse);
  });
});
