import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
      }),
      inject: [],
    }),
  ],
  exports: [JwtModule],
})
export class NestJwtModule {}
