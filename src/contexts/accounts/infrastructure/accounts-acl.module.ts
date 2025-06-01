import { DynamicModule, Module, Type } from '@nestjs/common';
import { AccountOwnershipPort } from 'src/shared/contracts/account-ownership.port';
import { AccountOwnershipAcl } from './acls/account-ownership.acl';
import { AccountExistsPort } from 'src/shared/contracts/account-exists.port';
import { AccountExistsAcl } from './acls/account-exists.acl';

@Module({
  providers: [
    {
      provide: AccountOwnershipPort,
      useClass: AccountOwnershipAcl,
    },
    {
      provide: AccountExistsPort,
      useClass: AccountExistsAcl,
    },
  ],
  exports: [AccountOwnershipPort, AccountExistsPort],
})
export class AccountsAclModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: AccountsAclModule,
      imports: [infrastructureModule],
    } as DynamicModule;
  }
}
