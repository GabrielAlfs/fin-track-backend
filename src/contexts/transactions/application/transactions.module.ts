import { DynamicModule, Module, Type } from '@nestjs/common';
import { TransactionsController } from '../presentation/http/transactions.controller';
import { TransactionsFacade } from './transactions.facade';
import { TransactionFactory } from '../domain/factories/transaction.factory';
import { CreateTransactionCommandHandler } from './commands/create-transaction/create-transaction.command-handler';
import { PerformRefundCommandHandler } from './commands/perform-refund/perform-refund.command-handler';
import { ListTransactionsQueryHandler } from './queries/list-transactions/list-transactions.query-handler';
import { TransactionViewModel } from '../presentation/http/viewmodels/transaction.view-model';

@Module({
  controllers: [TransactionsController],
  providers: [
    // Facades
    TransactionsFacade,

    // Factories
    TransactionFactory,

    // Query Handlers
    ListTransactionsQueryHandler,

    // Command Handlers
    CreateTransactionCommandHandler,
    PerformRefundCommandHandler,

    // View Models
    TransactionViewModel,
  ],
})
export class TransactionsModule {
  static withInfrastructure(options: {
    module: Type | DynamicModule;
    acls?: Array<Type | DynamicModule>;
  }) {
    return {
      module: TransactionsModule,
      imports: [options.module, ...(options.acls ?? [])],
    };
  }
}
