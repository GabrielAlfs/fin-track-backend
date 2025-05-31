import {
  Transaction,
  TransactionType,
} from 'src/contexts/transactions/domain/transaction';
import {
  Transaction as PrismaTransaction,
  TransactionType as PrismaTransactionType,
} from '@prisma/client';

export class PrismaTransactionMapper {
  public static typeToDomain(
    prismaTransactionType: PrismaTransactionType,
  ): TransactionType {
    const typeToDomainMap: Record<PrismaTransactionType, TransactionType> = {
      [PrismaTransactionType.INCOME]: TransactionType.INCOME,
      [PrismaTransactionType.EXPENSE]: TransactionType.EXPENSE,
      [PrismaTransactionType.REFUND]: TransactionType.REFUND,
    };

    return typeToDomainMap[prismaTransactionType];
  }

  public static typeToPersistence(
    transactionType: TransactionType,
  ): PrismaTransactionType {
    const typeToPersistenceMap: Record<TransactionType, PrismaTransactionType> =
      {
        [TransactionType.INCOME]: PrismaTransactionType.INCOME,
        [TransactionType.EXPENSE]: PrismaTransactionType.EXPENSE,
        [TransactionType.REFUND]: PrismaTransactionType.REFUND,
      };

    return typeToPersistenceMap[transactionType];
  }

  static toDomain(prismaTransaction: PrismaTransaction): Transaction {
    const {
      type,
      originalTransactionId,
      description,
      ...remainingTransaction
    } = prismaTransaction;

    return new Transaction({
      ...remainingTransaction,
      type: this.typeToDomain(type),
      ...(originalTransactionId ? { originalTransactionId } : {}),
      ...(description ? { description } : {}),
    });
  }

  static toPersistence(transaction: Transaction): PrismaTransaction {
    const {
      type,
      originalTransactionId,
      description,
      ...remainingTransaction
    } = transaction;

    return {
      ...remainingTransaction,
      type: this.typeToPersistence(type),
      originalTransactionId: originalTransactionId || null,
      description: description || null,
    };
  }

  static toDomainList(
    prismaTransactions: Array<PrismaTransaction>,
  ): Array<Transaction> {
    return prismaTransactions.map((prismaTransaction) =>
      this.toDomain(prismaTransaction),
    );
  }

  static toPersistenceList(
    transactions: Array<Transaction>,
  ): Array<PrismaTransaction> {
    return transactions.map((transaction) => this.toPersistence(transaction));
  }
}
