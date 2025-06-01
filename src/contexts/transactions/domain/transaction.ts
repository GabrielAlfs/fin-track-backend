export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  REFUND = 'refund',
}

export interface TransactionParams {
  id: string;
  accountId: string;
  amountInCents: number;
  type: TransactionType;
  description?: string;
  originalTransactionId?: string;
  createdAt: Date;
}

export class Transaction implements TransactionParams {
  id: string;
  accountId: string;
  amountInCents: number;
  type: TransactionType;
  description?: string;
  originalTransactionId?: string;
  createdAt: Date;

  constructor(params: TransactionParams) {
    Object.assign(this, params);
  }

  isRefund(): boolean {
    return this.type === TransactionType.REFUND;
  }
}
