import { TokenManagementRepository } from '../../../core/contexts/user/contracts/TokenManagementRepository';
import { redisClient } from '../../../config/redis';

export class RedisTokenManagementRepository implements TokenManagementRepository {
  async addToken(token: string, expiresAt: Date): Promise<boolean> {
    const key = `blacklisted_token:${token}`;
    const expirationSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    const response = await redisClient.set(key, '1', 'EX', expirationSeconds);
    return response === 'OK';
  }

  async findToken(token: string): Promise<boolean> {
    const key = `blacklisted_token:${token}`;
    const result = await redisClient.get(key);
    return result !== null;
  }
}
