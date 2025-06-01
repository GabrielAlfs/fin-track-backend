import { PerformRefundCommandHandler } from './perform-refund.command-handler';
import { PerformRefundCommand } from './perform-refund.command';
import {
  Transaction,
  TransactionType,
} from 'src/contexts/transactions/domain/transaction';
import { TransactionRepository } from '../../ports/transaction.repository';
import { TransactionFactory } from 'src/contexts/transactions/domain/factories/transaction.factory';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('PerformRefundCommandHandler', () => {
  let handler: PerformRefundCommandHandler;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let transactionFactory: jest.Mocked<TransactionFactory>;

  const transactionId = faker.string.uuid();
  const accountId = faker.string.uuid();
  const amountInCents = faker.number.int({ min: 100, max: 10000 });
  const description = faker.commerce.productDescription();

  const originalTransaction: Transaction = new Transaction({
    id: transactionId,
    accountId,
    amountInCents,
    type: TransactionType.EXPENSE,
    description: faker.commerce.product(),
    createdAt: faker.date.recent(),
  });

  const refundTransaction: Transaction = new Transaction({
    id: faker.string.uuid(),
    accountId,
    amountInCents,
    type: TransactionType.REFUND,
    description,
    originalTransactionId: transactionId,
    createdAt: faker.date.recent(),
  });

  beforeEach(() => {
    transactionRepository = {
      findById: jest.fn(),
      findRefundByOriginalId: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    transactionFactory = {
      create: jest.fn(),
    } as unknown as jest.Mocked<TransactionFactory>;

    handler = new PerformRefundCommandHandler(
      transactionRepository,
      transactionFactory,
    );
  });

  it('should create and return a refund transaction', async () => {
    transactionRepository.findById.mockResolvedValue(originalTransaction);
    transactionRepository.findRefundByOriginalId.mockResolvedValue(null);
    transactionFactory.create.mockReturnValue(refundTransaction);

    const command = new PerformRefundCommand({
      transactionId,
      accountId,
      description,
    });

    const result = await handler.execute(command);

    expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
    expect(transactionRepository.findRefundByOriginalId).toHaveBeenCalledWith(
      transactionId,
    );
    expect(transactionFactory.create).toHaveBeenCalledWith({
      accountId,
      description,
      type: TransactionType.REFUND,
      amountInCents,
      originalTransactionId: transactionId,
    });
    expect(transactionRepository.save).toHaveBeenCalledWith(refundTransaction);
    expect(result).toBe(refundTransaction);
  });

  it('should throw NotFoundException if original transaction does not exist', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    const command = new PerformRefundCommand({
      transactionId,
      accountId,
      description,
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new NotFoundException(
        `Transaction with ID ${transactionId} does not exist.`,
      ),
    );
  });

  it('should throw ForbiddenException if transaction belongs to another account', async () => {
    const otherAccountId = faker.string.uuid();
    transactionRepository.findById.mockResolvedValue(
      new Transaction({
        ...originalTransaction,
        accountId: otherAccountId,
      }),
    );

    const command = new PerformRefundCommand({
      transactionId,
      accountId,
      description,
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new ForbiddenException(
        `Transaction with ID ${transactionId} does not belong to account with ID ${accountId}.`,
      ),
    );
  });

  it('should throw ConflictException if transaction is already a refund', async () => {
    const alreadyRefund = new Transaction({
      ...originalTransaction,
      type: TransactionType.REFUND,
    });

    transactionRepository.findById.mockResolvedValue(alreadyRefund);

    const command = new PerformRefundCommand({
      transactionId,
      accountId,
      description,
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new ConflictException(
        `Transaction with ID ${transactionId} is already a refund.`,
      ),
    );
  });

  it('should throw ConflictException if refund already exists for the transaction', async () => {
    transactionRepository.findById.mockResolvedValue(originalTransaction);
    transactionRepository.findRefundByOriginalId.mockResolvedValue(
      refundTransaction,
    );

    const command = new PerformRefundCommand({
      transactionId,
      accountId,
      description,
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new ConflictException(
        `Refund for transaction with ID ${transactionId} already exists.`,
      ),
    );
  });
});
