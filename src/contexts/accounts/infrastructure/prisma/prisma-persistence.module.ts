import { Module } from '@nestjs/common';
import { AccountRepository } from '../../application/ports/account.repository';
import { PrismaAccountRepository } from './repositories/prisma-account.repository';

@Module({
  providers: [
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository,
    },
  ],
  exports: [AccountRepository],
})
export class PrismaPersistenceModule {}
