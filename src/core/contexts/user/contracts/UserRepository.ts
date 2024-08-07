import { UserEntity } from "../entities/UserEntity";

export interface UserRepository {
  getAll(): Promise<UserEntity[]>

}