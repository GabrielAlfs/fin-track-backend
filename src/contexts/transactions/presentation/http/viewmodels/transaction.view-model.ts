import { Injectable } from '@nestjs/common';
import { MoneyTransformer } from 'src/contexts/transactions/application/ports/money.transformer';
import { Transaction } from 'src/contexts/transactions/domain/transaction';
import { format } from 'date-fns';
import { tz } from '@date-fns/tz';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/core/config/configuration';

@Injectable()
export class TransactionViewModel {
  constructor(
    private readonly moneyTransformer: MoneyTransformer,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  toHTTP(transaction: Transaction) {
    const timezone = this.configService.get<string>('timezone');
    return {
      id: transaction.id,
      amount: this.moneyTransformer.fromCents(transaction.amountInCents),
      type: transaction.type,
      description: transaction.description,
      createdAt: format(transaction.createdAt, 'MMMM dd, yyyy', {
        in: tz(timezone),
      }),
    };
  }
}
