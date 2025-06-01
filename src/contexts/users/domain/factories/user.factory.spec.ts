import { UserFactory } from './user.factory';
import { faker } from '@faker-js/faker';

describe('UserFactory', () => {
  let factory: UserFactory;

  beforeEach(() => {
    factory = new UserFactory();
  });

  const createFakeParams = () => ({
    username: faker.internet.username(),
  });

  it('should create a User with generated id and current date', () => {
    const params = createFakeParams();
    const user = factory.create(params);

    expect(user).toBeDefined();
    expect(user.id).toMatch(/^[0-9a-fA-F-]{36}$/);
    expect(user.username).toBe(params.username);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should generate unique IDs on multiple creations', () => {
    const u1 = factory.create(createFakeParams());
    const u2 = factory.create(createFakeParams());

    expect(u1.id).not.toBe(u2.id);
  });

  it('should set createdAt to approximately now', () => {
    const before = Date.now();
    const user = factory.create(createFakeParams());
    const after = Date.now();

    expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(user.createdAt.getTime()).toBeLessThanOrEqual(after);
  });
});
