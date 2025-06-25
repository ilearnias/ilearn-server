import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from './users.entity';

export const UsersProvider: Provider[] = [
  {
    provide: 'UserRepository',
    useValue: Users,
  },
  {
    provide: "CreateToken",
    useFactory: (jwtService: JwtService) => async (user: Users, fid: number) => {
      try {
        const token = jwtService.sign(
          {
            id: user.id,
            roleId: user.role_id,
            fid,
          },
          {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          }
        );
        return token;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    inject: [JwtService],
  },
  {
    provide: "CreateVerifyToken",
    useFactory: (jwtService: JwtService) => async (email: string) => {
      try {
        const token = jwtService.sign(
          { data: { email } },
          {
            secret: process.env.VERIFY_JWT_SECRET,
            expiresIn: process.env.VERIFY_TOKEN_EXPIRY,
          }
        );
        return token;
      } catch (error) {
        return null;
      }
    },
    inject: [JwtService],
  }
];
