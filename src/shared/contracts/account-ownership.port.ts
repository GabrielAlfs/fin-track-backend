export abstract class AccountOwnershipPort {
  abstract accountBelongsToUser(params: {
    accountId: string;
    userId: string;
  }): Promise<boolean>;
}
