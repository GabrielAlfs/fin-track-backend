import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PerformRefundCommand } from './perform-refund.command';
import {
  Transaction,
  TransactionType,
} from 'src/contexts/transactions/domain/transaction';
import { TransactionRepository } from '../../ports/transaction.repository';
import { Assert } from 'src/common/util/assert';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionFactory } from 'src/contexts/transactions/domain/factories/transaction.factory';

@CommandHandler(PerformRefundCommand)
export class PerformRefundCommandHandler
  implements ICommandHandler<PerformRefundCommand, Transaction>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionFactory: TransactionFactory,
  ) {}

  async execute({
    transactionId,
    accountId,
    description,
  }: PerformRefundCommand): Promise<Transaction> {
    const originalTransaction = Assert.notEmpty(
      await this.transactionRepository.findById(transactionId),
      new NotFoundException(
        `Transaction with ID ${transactionId} does not exist.`,
      ),
    );

    Assert.isTrue(
      originalTransaction.accountId === accountId,
      new ForbiddenException(
        `Transaction with ID ${transactionId} does not belong to account with ID ${accountId}.`,
      ),
    );

    Assert.isFalse(
      originalTransaction.isRefund(),
      new ConflictException(
        `Transaction with ID ${transactionId} is already a refund.`,
      ),
    );

    Assert.isEmpty(
      await this.transactionRepository.findRefundByOriginalId(transactionId),
      new ConflictException(
        `Refund for transaction with ID ${transactionId} already exists.`,
      ),
    );

    const refundTransaction = this.transactionFactory.create({
      accountId: originalTransaction.accountId,
      description,
      type: TransactionType.REFUND,
      amountInCents: originalTransaction.amountInCents,
      originalTransactionId: originalTransaction.id,
    });

    await this.transactionRepository.save(refundTransaction);

    return refundTransaction;
  }
}
