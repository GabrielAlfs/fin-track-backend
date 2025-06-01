import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { TransactionFactory } from 'src/contexts/transactions/domain/factories/transaction.factory';
import { TransactionRepository } from '../../ports/transaction.repository';
import { Assert } from 'src/common/util/assert';
import { NotFoundException } from '@nestjs/common';
import { Transaction } from 'src/contexts/transactions/domain/transaction';
import { MoneyTransformer } from '../../ports/money.transformer';
import { AccountExistsPort } from 'src/shared/contracts/account-exists.port';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand, Transaction>
{
  constructor(
    private readonly accountExistsPort: AccountExistsPort,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionFactory: TransactionFactory,
    private readonly moneyTransformer: MoneyTransformer,
  ) {}

  async execute({
    accountId,
    amount,
    type,
    description,
  }: CreateTransactionCommand): Promise<Transaction> {
    Assert.isTrue(
      await this.accountExistsPort.accountExists(accountId),
      new NotFoundException(`Account with ID ${accountId} does not exist.`),
    );

    const amountInCents = this.moneyTransformer.toCents(amount);

    const newTransaction = this.transactionFactory.create({
      accountId,
      amountInCents,
      type,
      description,
    });

    await this.transactionRepository.save(newTransaction);

    return newTransaction;
  }
}
