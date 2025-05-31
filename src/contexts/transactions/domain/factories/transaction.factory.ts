import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Transaction, TransactionParams } from '../transaction';

@Injectable()
export class TransactionFactory {
  create(params: Omit<TransactionParams, 'id' | 'createdAt'>): Transaction {
    const transaction = new Transaction({
      id: randomUUID(),
      ...params,
      createdAt: new Date(),
    });

    return transaction;
  }
}
