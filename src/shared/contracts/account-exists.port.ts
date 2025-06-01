export abstract class AccountExistsPort {
  abstract accountExists(accountId: string): Promise<boolean>;
}
