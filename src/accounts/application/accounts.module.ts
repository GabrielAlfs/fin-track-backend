import { DynamicModule, Module, Type } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AccountsModule {
  static withInfrastructure(options: {
    module: Type | DynamicModule;
    acls?: Array<Type | DynamicModule>;
  }) {
    return {
      module: AccountsModule,
      imports: [options.module, ...(options.acls ?? [])],
    };
  }
}
