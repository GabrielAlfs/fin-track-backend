import { Controller, Get } from '@nestjs/common';

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
