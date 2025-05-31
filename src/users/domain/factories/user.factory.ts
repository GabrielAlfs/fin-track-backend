import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User, UserParams } from '../user';

@Injectable()
export class UserFactory {
  create(params: Omit<UserParams, 'id' | 'createdAt'>): User {
    const user = new User({
      id: randomUUID(),
      ...params,
      createdAt: new Date(),
    });

    return user;
  }
}
