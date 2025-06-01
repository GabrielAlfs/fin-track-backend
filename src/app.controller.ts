import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  async ping() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
