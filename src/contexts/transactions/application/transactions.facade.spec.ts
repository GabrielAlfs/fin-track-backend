import { TransactionsFacade } from './transactions.facade';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './commands/create-transaction/create-transaction.command';
import { PerformRefundCommand } from './commands/perform-refund/perform-refund.command';
import { ListTransactionsQuery } from './queries/list-transactions/list-transactions.query';
import { faker } from '@faker-js/faker';
import { TransactionType } from '../domain/transaction';

describe('TransactionsFacade', () => {
  let facade: TransactionsFacade;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(() => {
    commandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    queryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    facade = new TransactionsFacade(queryBus, commandBus);
  });

  it('should call queryBus.execute with ListTransactionsQuery', async () => {
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

    const expectedResult = { data: [], total: 0, page: 1, limit: 10 };
    queryBus.execute.mockResolvedValue(expectedResult);

    const result = await facade.list(query);

    expect(queryBus.execute).toHaveBeenCalledWith(query);
    expect(result).toBe(expectedResult);
  });

  it('should call commandBus.execute with CreateTransactionCommand', async () => {
    const command = new CreateTransactionCommand({
      accountId: faker.string.uuid(),
      amount: faker.number.float({ min: 1, max: 100 }),
      type: TransactionType.INCOME,
      description: faker.commerce.productDescription(),
    });

    const expectedResponse = { success: true };
    commandBus.execute.mockResolvedValue(expectedResponse);

    const result = await facade.create(command);

    expect(commandBus.execute).toHaveBeenCalledWith(command);
    expect(result).toBe(expectedResponse);
  });

  it('should call commandBus.execute with PerformRefundCommand', async () => {
    const command = new PerformRefundCommand({
      transactionId: faker.string.uuid(),
      accountId: faker.string.uuid(),
      description: faker.commerce.productDescription(),
    });

    const expectedRefund = { id: faker.string.uuid() };
    commandBus.execute.mockResolvedValue(expectedRefund);

    const result = await facade.refund(command);

    expect(commandBus.execute).toHaveBeenCalledWith(command);
    expect(result).toBe(expectedRefund);
  });
});
