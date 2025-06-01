import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../application/ports/account.repository';
import { AccountExistsPort } from 'src/shared/contracts/account-exists.port';

@Injectable()
export class AccountExistsAcl implements AccountExistsPort {
  constructor(private readonly accountRepository: AccountRepository) {}

  async accountExists(accountId: string): Promise<boolean> {
    const account = await this.accountRepository.findById(accountId);
    return !!account;
  }
}
