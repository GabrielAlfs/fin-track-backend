import { DynamicModule, Module, Type } from '@nestjs/common';
import { AccountOwnershipPort } from 'src/shared/contracts/account-ownership.port';
import { AccountOwnershipAcl } from './acls/account-ownership.acl';

@Module({
  providers: [
    {
      provide: AccountOwnershipPort,
      useClass: AccountOwnershipAcl,
    },
  ],
  exports: [AccountOwnershipPort],
})
export class AccountsAclModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: AccountsAclModule,
      imports: [infrastructureModule],
    } as DynamicModule;
  }
}
