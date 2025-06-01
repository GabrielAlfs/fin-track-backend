import { TransactionViewModel } from './transaction.view-model';
import {
  TransactionType,
  Transaction,
  TransactionParams,
} from 'src/contexts/transactions/domain/transaction';
import { MoneyTransformer } from 'src/contexts/transactions/application/ports/money.transformer';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import { EnvironmentVariables } from 'src/core/config/configuration';
import { tz } from '@date-fns/tz';

describe('TransactionViewModel', () => {
  let viewModel: TransactionViewModel;
  let moneyTransformer: MoneyTransformer;
  let configService: ConfigService<EnvironmentVariables>;

  const TIMEZONE = process.env.TZ;

  const buildMockTransaction = (params?: Partial<TransactionParams>) =>
    new Transaction({
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      amountInCents: 2599,
      type: TransactionType.EXPENSE,
      description: 'Coffee Purchase',
      createdAt: new Date('2025-12-25T00:00:00.000Z'),
      ...params,
    });

  beforeEach(() => {
    moneyTransformer = {
      fromCents: jest
        .fn()
        .mockImplementation((cents: number) => (cents / 100).toFixed(2)),
      toCents: jest
        .fn()
        .mockImplementation((amount: number) => Math.round(amount * 100)),
    };

    configService = {
      get: jest.fn().mockImplementation((key: keyof EnvironmentVariables) => {
        if (key === 'timezone') return TIMEZONE;
        return undefined;
      }),
    } as unknown as ConfigService<EnvironmentVariables, false>;

    viewModel = new TransactionViewModel(moneyTransformer, configService);
  });

  it('should transform a transaction domain object into a correct HTTP response', () => {
    const transaction = buildMockTransaction();

    const result = viewModel.toHTTP(transaction);

    expect(moneyTransformer.fromCents).toHaveBeenCalledWith(2599);
    expect(configService.get).toHaveBeenCalledWith('timezone');

    expect(result).toEqual({
      id: transaction.id,
      amount: '25.99',
      type: transaction.type,
      description: transaction.description,
      createdAt: format(transaction.createdAt, 'MMMM dd, yyyy', {
        in: tz(TIMEZONE),
      }),
    });
  });

  it('should format date with timezone', () => {
    const date = new Date('2025-12-25T00:00:00.000Z');

    const transaction = buildMockTransaction({ createdAt: date });

    const result = viewModel.toHTTP(transaction);

    expect(result.createdAt).toBe('December 25, 2025');
  });
});
