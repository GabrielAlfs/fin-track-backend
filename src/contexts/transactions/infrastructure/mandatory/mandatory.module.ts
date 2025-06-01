import { Module } from '@nestjs/common';
import { MoneyTransformer } from '../../application/ports/money.transformer';
import { DecimalMoneyTransformer } from './decimal/decimal.money.transformer';

@Module({
  providers: [
    {
      provide: MoneyTransformer,
      useClass: DecimalMoneyTransformer,
    },
  ],
  exports: [MoneyTransformer],
})
export class MandatoryModule {}
