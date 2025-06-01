import { AccountFactory } from './account.factory';
import { faker } from '@faker-js/faker';

describe('AccountFactory', () => {
  let factory: AccountFactory;

  beforeEach(() => {
    factory = new AccountFactory();
  });

  it('should create an Account with valid fields', () => {
    const userId = faker.string.uuid();
    const account = factory.create({ userId });

    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
    expect(account.userId).toEqual(userId);
    expect(account.balanceInCents).toEqual(0);
    expect(account.createdAt).toBeInstanceOf(Date);
    expect(account.updatedAt).toBeInstanceOf(Date);
  });

  it('should set createdAt and updatedAt to the same value', () => {
    const userId = faker.string.uuid();
    const account = factory.create({ userId });

    expect(account.createdAt.getTime()).toEqual(account.updatedAt.getTime());
  });

  it('should generate unique IDs on each creation', () => {
    const userId1 = faker.string.uuid();
    const userId2 = faker.string.uuid();

    const a1 = factory.create({ userId: userId1 });
    const a2 = factory.create({ userId: userId2 });

    expect(a1.id).not.toEqual(a2.id);
  });

  it('should set createdAt to roughly now', () => {
    const before = Date.now();
    const account = factory.create({ userId: faker.string.uuid() });
    const after = Date.now();

    expect(account.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(account.createdAt.getTime()).toBeLessThanOrEqual(after);
  });
});
