export abstract class UserExistsPort {
  abstract userExists(userId: string): Promise<boolean>;
}
