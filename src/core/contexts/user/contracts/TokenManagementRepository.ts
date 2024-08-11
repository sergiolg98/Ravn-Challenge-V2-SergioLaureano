export interface TokenManagementRepository {
  addToken(token: string, expiresAt: Date): Promise<boolean>;
  findToken(token: string): Promise<boolean>;
}
