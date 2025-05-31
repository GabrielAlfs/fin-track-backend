import { User } from 'src/users/domain/user';
import { User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User({
      ...prismaUser,
    });
  }

  static toPersistence(user: User): PrismaUser {
    return {
      ...user,
    };
  }

  static toDomainList(prismaUsers: Array<PrismaUser>): Array<User> {
    return prismaUsers.map((prismaUser) => this.toDomain(prismaUser));
  }

  static toPersistenceList(users: Array<User>): Array<PrismaUser> {
    return users.map((user) => this.toPersistence(user));
  }
}
