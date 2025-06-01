import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './commands/create-transaction/create-transaction.command';
import { PerformRefundCommand } from './commands/perform-refund/perform-refund.command';
import { ListTransactionsQuery } from './queries/list-transactions/list-transactions.query';

@Injectable()
export class TransactionsFacade {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async list(listTransactionsQuery: ListTransactionsQuery) {
    return this.queryBus.execute(listTransactionsQuery);
  }

  async create(createTransactionCommand: CreateTransactionCommand) {
    return this.commandBus.execute(createTransactionCommand);
  }

  async refund(performRefundCommand: PerformRefundCommand) {
    return this.commandBus.execute(performRefundCommand);
  }
}
