import { TransactionFactory } from './transaction.factory';
import { TransactionType } from '../transaction';
import { faker } from '@faker-js/faker';

describe('TransactionFactory', () => {
  let factory: TransactionFactory;

  beforeEach(() => {
    factory = new TransactionFactory();
  });

  const createFakeParams = () => ({
    accountId: faker.string.uuid(),
    type: faker.helpers.arrayElement([
      TransactionType.INCOME,
      TransactionType.EXPENSE,
      TransactionType.REFUND,
    ]),
    amountInCents: Number(faker.number.int({ min: 100, max: 10000 })),
    updatedAt: faker.date.recent(),
    description: faker.lorem.sentence(),
    originalTransactionId: faker.datatype.boolean()
      ? faker.string.uuid()
      : null,
  });

  it('should create a Transaction with valid fields', () => {
    const params = createFakeParams();
    const transaction = factory.create(params);

    expect(transaction).toBeDefined();
    expect(transaction.id).toBeDefined();
    expect(transaction.createdAt).toBeInstanceOf(Date);

    // Verify fields are mapped correctly
    expect(transaction.accountId).toEqual(params.accountId);
    expect(transaction.type).toEqual(params.type);
    expect(transaction.amountInCents).toEqual(params.amountInCents);
    expect(transaction.description).toEqual(params.description);
    expect(transaction.originalTransactionId).toEqual(
      params.originalTransactionId,
    );
  });

  it('should generate unique IDs on each creation', () => {
    const t1 = factory.create(createFakeParams());
    const t2 = factory.create(createFakeParams());

    expect(t1.id).not.toEqual(t2.id);
  });

  it('should set createdAt to now (roughly)', () => {
    const before = Date.now();
    const transaction = factory.create(createFakeParams());
    const after = Date.now();

    expect(transaction.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(transaction.createdAt.getTime()).toBeLessThanOrEqual(after);
  });
});
