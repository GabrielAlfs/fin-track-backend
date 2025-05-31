import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthUser } from 'src/common/types/auth-user.types';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor() {}

  @Get()
  whoAmI(@CurrentUser() user: AuthUser) {
    return user;
  }
}
