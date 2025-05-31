import { Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './prisma/prisma-persistence.module';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';

@Module({})
export class AccountsInfrastructureModule {
  static use({ persistenceDriver }: ApplicationBootstrapOptions) {
    const persistenceModules =
      {
        prisma: [PrismaPersistenceModule],
      }[persistenceDriver] || null;

    return {
      module: AccountsInfrastructureModule,
      imports: [...persistenceModules],
      exports: [...persistenceModules],
    };
  }
}
