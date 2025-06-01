import { Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './prisma/prisma-persistence.module';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import { MandatoryModule } from './mandatory/mandatory.module';

@Module({})
export class TransactionsInfrastructureModule {
  static use({ persistenceDriver }: ApplicationBootstrapOptions) {
    const persistenceModules =
      {
        prisma: [PrismaPersistenceModule],
      }[persistenceDriver] || null;

    return {
      module: TransactionsInfrastructureModule,
      imports: [MandatoryModule, ...persistenceModules],
      exports: [MandatoryModule, ...persistenceModules],
    };
  }
}
