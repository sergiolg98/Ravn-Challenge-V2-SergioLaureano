import { UserEntity } from "../entities/UserEntity";

export interface UserRepository {
  getAll(): Promise<UserEntity[]>
  create(user: UserEntity): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;

}