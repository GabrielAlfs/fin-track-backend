import { Module } from '@nestjs/common';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class PrismaPersistenceModule {}
