import { Injectable } from '@nestjs/common';
import { MoneyTransformer } from 'src/contexts/transactions/application/ports/money.transformer';
import Decimal from 'decimal.js';

@Injectable()
export class DecimalMoneyTransformer implements MoneyTransformer {
  toCents(amount: number): number {
    return new Decimal(amount)
      .mul(100)
      .toDecimalPlaces(0, Decimal.ROUND_HALF_EVEN)
      .toNumber();
  }

  fromCents(amountInCents: number): number {
    return new Decimal(amountInCents)
      .div(100)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN)
      .toNumber();
  }
}
