import { Module } from "@nestjs/common";
import { TokenManagmentProvider } from "./token_management.provider";
import { JwtService } from "@nestjs/jwt";
import { TokenManagementService } from "./token_management.service";

@Module({
  imports: [],
  controllers: [],
  providers: [JwtService,TokenManagementService, ...TokenManagmentProvider],
  exports: [TokenManagementService],
})
export class TokenManagementModule {}
