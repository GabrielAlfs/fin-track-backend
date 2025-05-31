import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthUser } from 'src/common/types/auth-user.types';
import { AccountGuard } from 'src/shared/guards/account.guard';
import { AuthSelectedAccount } from 'src/common/types/auth-selected-account.types';
import { SelectedAccount } from 'src/common/decorators/selected-account.decorator';

@UseGuards(AuthGuard, AccountGuard)
@Controller('users')
export class UsersController {
  constructor() {}

  @Get()
  whoAmI(
    @CurrentUser() user: AuthUser,
    @SelectedAccount() account: AuthSelectedAccount,
  ) {
    return {
      userId: user.sub,
      selectedAccountId: account.accountId,
    };
  }
}
