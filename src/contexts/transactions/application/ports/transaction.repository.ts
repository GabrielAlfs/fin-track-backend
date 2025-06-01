import { Paginated } from 'src/common/interfaces/paginated.interface';
import { Transaction, TransactionType } from '../../domain/transaction';

export abstract class TransactionRepository {
  abstract paginate(params: {
    limit: number;
    page: number;
    sort: string;
    order: 'asc' | 'desc';
    type?: TransactionType;
    accountId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Paginated<Transaction>>;

  abstract findById(id: string): Promise<Transaction | null>;

  abstract findRefundByOriginalId(
    originalTransactionId: string,
  ): Promise<Transaction | null>;

  abstract save(post: Transaction): Promise<Transaction>;
}
