import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/infrastructure/prisma/prisma.service';
import { UserRepository } from 'src/contexts/users/application/ports/user.repository';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { User } from 'src/contexts/users/domain/user';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
}
