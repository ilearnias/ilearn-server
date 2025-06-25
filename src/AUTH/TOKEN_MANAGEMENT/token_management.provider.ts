import { JwtService } from "@nestjs/jwt";
import { TokenManagement } from "./token_management.entity";

export const TokenManagmentProvider: any[] = [
  { provide: "TokenManagementRepository", useValue: TokenManagement },
  {
    provide: "createRefreshToken",
    useFactory:
      (jwtService: JwtService) => async (TokenManagement: TokenManagement) => {
        try {
          const token = jwtService.sign(
            {
              fid: TokenManagement.fid,
              otp: TokenManagement.otp,
            },
            {
              secret: process.env.REFRESH_TOKEN_SECRET,
              expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
          );
          return token;
        } catch (error) {
          return null;
        }
      },
    inject: [JwtService, "TokenManagementRepository"],
  },
];
