import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { TokenManagement } from "./token_management.entity";
  
  @Injectable()
  export class TokenManagementService {
    constructor(
      @Inject("TokenManagementRepository")
      private readonly repository: typeof TokenManagement,
      @Inject("createRefreshToken")
      private readonly createRefreshToken: (
        data: TokenManagement
      ) => Promise<string>,
      @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
  
    async createToken(userId: string): Promise<[string, number]> {
      try {
        const created = await this.repository.create({
          user_id:userId
        });
        const token = await this.createRefreshToken(created);
        return [token, created?.fid];
      } catch (err) {
        console.log("err===>",err)
        return null;
      }
    }
    async deleteToken(fid: number) {
      try {
        await this.repository.destroy({ where: { fid } });
        return true;
      } catch (err) {
        return false;
      }
    }
    async regenerateToken(otp: number, fid: number): Promise<[string, string]> {
      try {
        const user = await this.repository.findOne({ where: { otp } });
        if (!user) {
          await this.repository.destroy({ where: { fid } });
          await this.signOut(fid);
          throw new UnauthorizedException("Unauthorized Access.");
        }
        await this.repository.destroy({ where: { otp } });
        const created = await this.repository.create({
          user_id: user.user_id,
          fid,
        });
        const token = await this.createRefreshToken(created);
        return [token, user.user_id];
      } catch (err) {
        throw err;
      }
    }
  
    async signOut(fid: number) {
      try {
        if (fid) {
          const blacklist = await this.cacheManager.set(String(fid), true);
          await this.deleteToken(fid);
          return {}
        }
        return {}
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    }
    async signoutFromAll(userId: number) {
      try {
        const log = await this.repository.findAll({
          attributes: ["fid"],
          where: { user_id:userId },
        });
        for (const item of log) {
          const blacklist = await this.cacheManager.set(String(item?.fid), true);
        }
        await this.repository.destroy({ where: { user_id:userId } });
        return log;
      } catch (err) {
        throw err;
      }
    }
  }
  