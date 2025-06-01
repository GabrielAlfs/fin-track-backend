import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { ListTransactionsQuery } from './list-transactions.query';
import { Transaction } from 'src/contexts/transactions/domain/transaction';
import { TransactionRepository } from '../../ports/transaction.repository';

@QueryHandler(ListTransactionsQuery)
export class ListTransactionsQueryHandler
  implements IQueryHandler<ListTransactionsQuery, Paginated<Transaction>>
{
  constructor(private readonly TransactionRepository: TransactionRepository) {}

  async execute(
    params: ListTransactionsQuery,
  ): Promise<Paginated<Transaction>> {
    const response = await this.TransactionRepository.paginate({ ...params });

    return response;
  }
}
