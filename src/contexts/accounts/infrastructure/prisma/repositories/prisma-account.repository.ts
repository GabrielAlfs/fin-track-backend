import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/infrastructure/prisma/prisma.service';
import { AccountRepository } from 'src/contexts/accounts/application/ports/account.repository';
import { PrismaAccountMapper } from '../mappers/prisma-account.mapper';
import { Account } from 'src/contexts/accounts/domain/account';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      return null;
    }

    return PrismaAccountMapper.toDomain(account);
  }
}
