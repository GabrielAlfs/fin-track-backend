import { Account } from '../../domain/account';

export abstract class AccountRepository {
  abstract findById(id: string): Promise<Account | null>;
}
