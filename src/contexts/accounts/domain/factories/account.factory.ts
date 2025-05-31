import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Account, AccountParams } from '../account';

@Injectable()
export class AccountFactory {
  create({ userId }: Pick<AccountParams, 'userId'>): Account {
    const createdAt = new Date();

    const account = new Account({
      id: randomUUID(),
      userId,
      balanceInCents: 0,
      createdAt,
      updatedAt: createdAt,
    });

    return account;
  }
}
