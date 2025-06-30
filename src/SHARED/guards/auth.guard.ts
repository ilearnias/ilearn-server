import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Cache } from 'cache-manager';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
// import { Users } from '../../AUTHH/USERS/users.entity';
import { Op } from 'sequelize';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let payload: any = null;
    //checking if the route is public or not
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    //checking if bearer token is found in the request object
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException('You have no access to this service');
    }

    try {
      //extract the token and add the data to the request object
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      request['id'] = payload?.id ?? null;
      request['roleId'] = payload?.roleId ?? null;
      request['fid'] = payload?.fid ?? null;

      const blacklist = await this.cacheManager.get(String(payload?.fid));
      if (blacklist) {
        throw new ForbiddenException(
          "UnAuthorized Access. You've already signed out",
        );
      }
    } catch (err) {
      console.log('err--->', err);
      throw new ForbiddenException('Invalid or Expired Token..');
    }
    //checking if the user has already signed out..
    const signedout = await this.cacheManager.get(payload?.accessKey);
    if (signedout)
      throw new UnauthorizedException({
        errors: [{ error: 'You have already signed out.' }],
      });

    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length <= 0) {
      throw new ForbiddenException(
        'You do not have the required permissions for this action.',
      );
    }

    // If permissions are required for this route, check if user has them
    if (requiredPermissions && requiredPermissions.length > 0) {
      // const hasPermission = await this.validatePermissions(
      //   payload?.id,
      //   requiredPermissions,
      // );
      // if (!hasPermission) {
      //   throw new ForbiddenException(
      //     'You do not have the required permissions for this action.',
      //   );
      // }
    }
    return true;
  }
  private extractTokenFromHeader(request: any): string | null {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  // Validates if the user has the required permissions
  // private async validatePermissions(
  //   userId: string,
  //   requiredPermissions: string[],
  // ): Promise<boolean> {
  //   try {
  //     // Get all roles assigned to the user
  //     const userRoles = await Users.findAll({
  //       where: { id: userId, isActive: true },
  //     });
  //     // If the user has any role with the required permissions, return true
  //     return userRoles.length > 0;
  //   } catch (error) {
  //     console.error('Error validating permissions:', error);
  //     return false;
  //   }
  // }
}
