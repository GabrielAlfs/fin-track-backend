import { Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/application/users.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';
import { AccountsModule } from './accounts/application/accounts.module';
import { AccountsInfrastructureModule } from './accounts/infrastructure/accounts-infrastructure.module';
import { TransactionsModule } from './transactions/application/transactions.module';
import { TransactionsInfrastructureModule } from './transactions/infrastructure/transactions-infrastructure.module';

@Module({
  imports: [],
  controllers: [AppController],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        UsersModule.withInfrastructure({
          module: UsersInfrastructureModule.use(options),
        }),
        AccountsModule.withInfrastructure({
          module: AccountsInfrastructureModule.use(options),
        }),
        TransactionsModule.withInfrastructure({
          module: TransactionsInfrastructureModule.use(options),
        }),
      ],
    };
  }
}
