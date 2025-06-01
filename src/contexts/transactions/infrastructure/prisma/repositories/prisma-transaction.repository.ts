import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/infrastructure/prisma/prisma.service';
import { TransactionRepository } from 'src/contexts/transactions/application/ports/transaction.repository';
import { PrismaTransactionMapper } from '../mappers/prisma-transaction.mapper';
import {
  Transaction,
  TransactionType,
} from 'src/contexts/transactions/domain/transaction';
import { Paginated } from 'src/common/interfaces/paginated.interface';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async paginate({
    limit,
    order,
    page,
    sort,
    type,
    accountId,
    endDate,
    startDate,
  }: {
    limit: number;
    page: number;
    sort: string;
    order: 'asc' | 'desc';
    type?: TransactionType;
    accountId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Paginated<Transaction>> {
    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where: {
          accountId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          ...(type
            ? { type: PrismaTransactionMapper.typeToPersistence(type) }
            : {}),
        },
        orderBy: {
          [sort]: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({
        where: {
          accountId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    const items = transactions.map((transaction) =>
      PrismaTransactionMapper.toDomain(transaction),
    );

    return {
      items,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    return transaction ? PrismaTransactionMapper.toDomain(transaction) : null;
  }

  async findRefundByOriginalId(
    originalTransactionId: string,
  ): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { originalTransactionId },
    });

    return transaction ? PrismaTransactionMapper.toDomain(transaction) : null;
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const data = PrismaTransactionMapper.toPersistence(transaction);

    const savedTransaction = await this.prisma.transaction.upsert({
      where: { id: transaction.id },
      create: data,
      update: data,
    });

    return PrismaTransactionMapper.toDomain(savedTransaction);
  }
}
