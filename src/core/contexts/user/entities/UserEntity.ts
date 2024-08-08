import { Role } from "../constants/roles";

export type UserEntity = {
  id?: number,
  name: string,
  email: string,
  password?: string,
  role: Role,
}

export interface UserCredentials {
  email: string,
  password: string,
}

export interface AuthResponse {
  user: UserEntity,
  token: string,
}
