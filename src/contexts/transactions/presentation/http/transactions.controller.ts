import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsFacade } from '../../application/transactions.facade';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccountGuard } from 'src/shared/guards/account.guard';
import { SelectedAccount } from 'src/common/decorators/selected-account.decorator';
import { AuthSelectedAccount } from 'src/common/types/auth-selected-account.types';
import { CreateTransactionCommand } from '../../application/commands/create-transaction/create-transaction.command';
import { TransactionType } from '../../domain/transaction';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionViewModel } from './viewmodels/transaction.view-model';
import { PerformRefundDto } from './dto/perform-refund.dto';
import { PerformRefundCommand } from '../../application/commands/perform-refund/perform-refund.command';
import { ListTransactionsDto } from './dto/list-transactions.dto';
import { ListTransactionsQuery } from '../../application/queries/list-transactions/list-transactions.query';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@UseGuards(AuthGuard, AccountGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionFacade: TransactionsFacade,
    private readonly transactionViewModel: TransactionViewModel,
  ) {}

  @Get()
  async listTransactions(
    @SelectedAccount() { accountId }: AuthSelectedAccount,
    @Query() listTransactionDto: ListTransactionsDto,
  ) {
    const mappedType = listTransactionDto.type
      ? {
          income: TransactionType.INCOME,
          expense: TransactionType.EXPENSE,
          refund: TransactionType.REFUND,
        }[listTransactionDto.type]
      : undefined;

    const { items, ...pagination } = await this.transactionFacade.list(
      new ListTransactionsQuery({
        accountId,
        ...listTransactionDto,
        type: mappedType,
      }),
    );

    return {
      items: items.map((item) => this.transactionViewModel.toHTTP(item)),
      ...pagination,
    };
  }

  @Post('incomes')
  async createIncome(
    @SelectedAccount() { accountId }: AuthSelectedAccount,
    @Body() payload: CreateTransactionDto,
  ) {
    const transaction = await this.transactionFacade.create(
      new CreateTransactionCommand({
        accountId,
        ...payload,
        type: TransactionType.INCOME,
      }),
    );

    return this.transactionViewModel.toHTTP(transaction);
  }

  @Post('expenses')
  async createExpense(
    @SelectedAccount() { accountId }: AuthSelectedAccount,
    @Body() payload: CreateTransactionDto,
  ) {
    const transaction = await this.transactionFacade.create(
      new CreateTransactionCommand({
        accountId,
        ...payload,
        type: TransactionType.EXPENSE,
      }),
    );

    return this.transactionViewModel.toHTTP(transaction);
  }

  @Patch(':transactionId/refund')
  async createRefund(
    @SelectedAccount() { accountId }: AuthSelectedAccount,
    @Param('transactionId') transactionId: string,
    @Body() { description }: PerformRefundDto,
  ) {
    const transaction = await this.transactionFacade.refund(
      new PerformRefundCommand({
        accountId,
        transactionId,
        description,
      }),
    );

    return this.transactionViewModel.toHTTP(transaction);
  }
}
