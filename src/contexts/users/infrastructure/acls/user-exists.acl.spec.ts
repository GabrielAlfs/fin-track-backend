import { UserExistsAcl } from './user-exists.acl';
import { UserRepository } from '../../application/ports/user.repository';
import { faker } from '@faker-js/faker';
import { User } from '../../domain/user';

describe('UserExistsAcl', () => {
  let acl: UserExistsAcl;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    acl = new UserExistsAcl(userRepository);
  });

  it('should return true if user exists', async () => {
    const user = new User({
      id: faker.string.uuid(),
      username: faker.internet.username(),
      createdAt: new Date(),
    });

    userRepository.findById.mockResolvedValue(user);

    const result = await acl.userExists(user.id);

    expect(result).toBe(true);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
  });

  it('should return false if user does not exist', async () => {
    const userId = faker.string.uuid();

    userRepository.findById.mockResolvedValue(null);

    const result = await acl.userExists(userId);

    expect(result).toBe(false);
  });
});
