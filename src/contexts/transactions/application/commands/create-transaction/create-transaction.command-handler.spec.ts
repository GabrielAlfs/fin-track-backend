import { CreateTransactionCommandHandler } from './create-transaction.command-handler';
import { CreateTransactionCommand } from './create-transaction.command';
import { TransactionFactory } from 'src/contexts/transactions/domain/factories/transaction.factory';
import { TransactionRepository } from '../../ports/transaction.repository';
import { MoneyTransformer } from '../../ports/money.transformer';
import { AccountExistsPort } from 'src/shared/contracts/account-exists.port';
import { NotFoundException } from '@nestjs/common';
import {
  Transaction,
  TransactionType,
} from 'src/contexts/transactions/domain/transaction';
import { faker } from '@faker-js/faker';

describe('CreateTransactionCommandHandler', () => {
  let handler: CreateTransactionCommandHandler;
  let mockAccountExistsPort: jest.Mocked<AccountExistsPort>;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;
  let mockTransactionFactory: jest.Mocked<TransactionFactory>;
  let mockMoneyTransformer: jest.Mocked<MoneyTransformer>;

  beforeEach(() => {
    mockAccountExistsPort = {
      accountExists: jest.fn(),
    };

    mockTransactionRepository = {
      save: jest.fn(),
      paginate: jest.fn(),
      findById: jest.fn(),
      findRefundByOriginalId: jest.fn(),
    };

    mockTransactionFactory = {
      create: jest.fn(),
    };

    mockMoneyTransformer = {
      toCents: jest.fn(),
      fromCents: jest.fn(),
    };

    handler = new CreateTransactionCommandHandler(
      mockAccountExistsPort,
      mockTransactionRepository,
      mockTransactionFactory,
      mockMoneyTransformer,
    );
  });

  it('should throw NotFoundException if account does not exist', async () => {
    const accountId = faker.string.uuid();
    const command: CreateTransactionCommand = {
      accountId,
      amount: faker.number.float({ min: 0.01, max: 1000 }),
      type: TransactionType.EXPENSE,
      description: faker.lorem.sentence(),
    };

    mockAccountExistsPort.accountExists.mockResolvedValue(false);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(mockAccountExistsPort.accountExists).toHaveBeenCalledWith(accountId);
  });

  it('should create and save a transaction when account exists', async () => {
    const accountId = faker.string.uuid();
    const amount = faker.number.float({ min: 0.01, max: 1000 });
    const amountInCents = Math.round(amount * 100);
    const type = faker.helpers.arrayElement([
      TransactionType.INCOME,
      TransactionType.EXPENSE,
    ]);
    const description = faker.lorem.sentence();

    const command: CreateTransactionCommand = {
      accountId,
      amount,
      type,
      description,
    };

    const fakeTransaction = {} as Transaction;

    mockAccountExistsPort.accountExists.mockResolvedValue(true);
    mockMoneyTransformer.toCents.mockReturnValue(amountInCents);
    mockTransactionFactory.create.mockReturnValue(fakeTransaction);

    const result = await handler.execute(command);

    expect(mockAccountExistsPort.accountExists).toHaveBeenCalledWith(accountId);
    expect(mockMoneyTransformer.toCents).toHaveBeenCalledWith(amount);
    expect(mockTransactionFactory.create).toHaveBeenCalledWith({
      accountId,
      amountInCents,
      type,
      description,
    });
    expect(mockTransactionRepository.save).toHaveBeenCalledWith(
      fakeTransaction,
    );
    expect(result).toBe(fakeTransaction);
  });
});
