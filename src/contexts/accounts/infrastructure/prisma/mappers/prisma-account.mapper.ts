import { Account } from 'src/contexts/accounts/domain/account';
import { Account as PrismaAccount } from '@prisma/client';

export class PrismaAccountMapper {
  static toDomain(prismaAccount: PrismaAccount): Account {
    return new Account({
      ...prismaAccount,
    });
  }

  static toPersistence(account: Account): PrismaAccount {
    return {
      ...account,
    };
  }

  static toDomainList(prismaAccounts: Array<PrismaAccount>): Array<Account> {
    return prismaAccounts.map((prismaAccount) => this.toDomain(prismaAccount));
  }

  static toPersistenceList(accounts: Array<Account>): Array<PrismaAccount> {
    return accounts.map((account) => this.toPersistence(account));
  }
}
