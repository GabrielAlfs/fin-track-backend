import { DynamicModule, Module, Type } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class TransactionsModule {
  static withInfrastructure(options: {
    module: Type | DynamicModule;
    acls?: Array<Type | DynamicModule>;
  }) {
    return {
      module: TransactionsModule,
      imports: [options.module, ...(options.acls ?? [])],
    };
  }
}
