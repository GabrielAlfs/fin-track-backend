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
import { AccountsAclModule } from './contexts/accounts/infrastructure/accounts-acl.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/config/configuration';
import { envValidate } from './core/config/env.validation';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: envValidate,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    const usersAclModule = UsersAclModule.withInfrastructure(
      UsersInfrastructureModule.use(options),
    );

    const accountsAclModule = AccountsAclModule.withInfrastructure(
      AccountsInfrastructureModule.use(options),
    );

    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        UsersModule.withInfrastructure({
          module: UsersInfrastructureModule.use(options),
          acls: [usersAclModule, accountsAclModule],
        }),
        AccountsModule.withInfrastructure({
          module: AccountsInfrastructureModule.use(options),
        }),
        TransactionsModule.withInfrastructure({
          module: TransactionsInfrastructureModule.use(options),
          acls: [usersAclModule, accountsAclModule],
        }),
      ],
    };
  }
}
