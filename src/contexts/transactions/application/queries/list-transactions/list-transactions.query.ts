import { TransactionType } from 'src/contexts/transactions/domain/transaction';

interface ListTransactionsQueryParams {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  type?: TransactionType;
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class ListTransactionsQuery implements ListTransactionsQueryParams {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  type?: TransactionType;
  accountId?: string;
  startDate?: Date;
  endDate?: Date;

  constructor(params: ListTransactionsQueryParams) {
    Object.assign(this, params);
  }
}
