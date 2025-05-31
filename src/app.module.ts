import { Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [CoreModule.forRoot(options)],
    };
  }
}
