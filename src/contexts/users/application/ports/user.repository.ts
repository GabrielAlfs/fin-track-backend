import { User } from 'src/contexts/users/domain/user';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
}
