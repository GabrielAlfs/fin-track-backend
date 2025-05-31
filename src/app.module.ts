import { Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { UsersModule } from './contexts/users/application/users.module';
import { UsersInfrastructureModule } from './contexts/users/infrastructure/users-infrastructure.module';
import { AccountsModule } from './contexts/accounts/application/accounts.module';
import { AccountsInfrastructureModule } from './contexts/accounts/infrastructure/accounts-infrastructure.module';
import { TransactionsModule } from './contexts/transactions/application/transactions.module';
import { TransactionsInfrastructureModule } from './contexts/transactions/infrastructure/transactions-infrastructure.module';
import { UsersAclModule } from './contexts/users/infrastructure/users-acl.module';
@Module({
  imports: [],
  controllers: [AppController],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    const usersAclModule = UsersAclModule.withInfrastructure(
      UsersInfrastructureModule.use(options),
    );

    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        UsersModule.withInfrastructure({
          module: UsersInfrastructureModule.use(options),
          acls: [usersAclModule],
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
