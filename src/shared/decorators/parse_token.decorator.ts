import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export class tokenData {
  userId: number;
  roleId:number
}

export const ParseToken = createParamDecorator(
  (data: "id" | "roleId" | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tokenData = {
      userId: request.id,
      roleId: request.roleId
    };
    return tokenData.userId && tokenData?.roleId ? tokenData : null;
  }
);
