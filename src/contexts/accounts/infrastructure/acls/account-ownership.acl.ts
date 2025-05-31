import { Injectable } from '@nestjs/common';
import { AccountOwnershipPort } from 'src/shared/contracts/account-ownership.port';
import { AccountRepository } from '../../application/ports/account.repository';

@Injectable()
export class AccountOwnershipAcl implements AccountOwnershipPort {
  constructor(private readonly accountRepository: AccountRepository) {}

  async accountBelongsToUser({
    accountId,
    userId,
  }: {
    accountId: string;
    userId: string;
  }): Promise<boolean> {
    const account = await this.accountRepository.findById(accountId);

    return account ? account.userId === userId : false;
  }
}
