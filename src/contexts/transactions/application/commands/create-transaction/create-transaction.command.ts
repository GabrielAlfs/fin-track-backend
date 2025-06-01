import { TransactionType } from 'src/contexts/transactions/domain/transaction';

interface CreateTransactionCommandParams {
  accountId: string;
  amount: number;
  description?: string;
  type: TransactionType;
}

export class CreateTransactionCommand
  implements CreateTransactionCommandParams
{
  accountId: string;
  amount: number;
  description?: string;
  type: TransactionType;

  constructor(params: CreateTransactionCommandParams) {
    Object.assign(this, params);
  }
}
