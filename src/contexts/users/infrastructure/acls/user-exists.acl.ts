import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../application/ports/user.repository';
import { UserExistsPort } from 'src/shared/contracts/user-exists.port';

@Injectable()
export class UserExistsAcl implements UserExistsPort {
  constructor(private readonly userRepository: UserRepository) {}

  async userExists(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    return !!user;
  }
}
