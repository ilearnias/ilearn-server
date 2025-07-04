import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { JwtStrategy } from './strategy/jwt_access.strategy';
import { userProviders } from '../user/user.provider';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.ACCESS_TOKEN_SECRET || 'your-secret-key',
        signOptions: {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h',
        },
      }),
      inject: [],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...userProviders],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
