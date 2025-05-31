import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/infrastructure/prisma/prisma.module';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';

@Global()
@Module({})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const persistenceImports =
      {
        prisma: [PrismaModule],
      }[options.persistenceDriver] || [];

    return {
      module: CoreModule,
      imports: [...persistenceImports],
    };
  }
}
