import { Module } from '@nestjs/common';
import { TransactionRepository } from '../../application/ports/transaction.repository';
import { PrismaTransactionRepository } from './repositories/prisma-transaction.repository';

@Module({
  providers: [
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [TransactionRepository],
})
export class PrismaPersistenceModule {}
