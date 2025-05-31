import { DynamicModule, Module, Type } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class UsersModule {
  static withInfrastructure(options: {
    module: Type | DynamicModule;
    acls?: Array<Type | DynamicModule>;
  }) {
    return {
      module: UsersModule,
      imports: [options.module, ...(options.acls ?? [])],
    };
  }
}
