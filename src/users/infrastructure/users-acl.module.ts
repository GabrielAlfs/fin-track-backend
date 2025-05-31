import { DynamicModule, Module, Type } from '@nestjs/common';
import { UserExistsPort } from 'src/shared/contracts/user-exists.port';
import { UserExistsAcl } from './acls/user-exists.acl';

@Module({
  providers: [
    {
      provide: UserExistsPort,
      useClass: UserExistsAcl,
    },
  ],
  exports: [UserExistsPort],
})
export class UsersAclModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: UsersAclModule,
      imports: [infrastructureModule],
    } as DynamicModule;
  }
}
