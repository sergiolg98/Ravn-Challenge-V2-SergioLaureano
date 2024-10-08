import { UserRepository } from '../../../core/contexts/user/contracts/UserRepository';
import { UserEntity } from '../../../core/contexts/user/entities/UserEntity';
import { PrismaClient } from '@prisma/client';

export class PostgresUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password!,
        role: user.role,
      },
    });
    return createdUser as UserEntity;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return (user as UserEntity) ?? null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return (user as UserEntity) ?? null;
  }
}
