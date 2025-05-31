import { DynamicModule, Module, Type } from '@nestjs/common';
import { UsersController } from '../presentation/http/users.controller';

@Module({
  controllers: [UsersController],
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
