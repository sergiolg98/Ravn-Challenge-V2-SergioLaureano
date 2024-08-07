import { Role } from "../constants/roles";

export type UserEntity = {
  id: number,
  name: string,
  email: string,
  role: Role,
}
