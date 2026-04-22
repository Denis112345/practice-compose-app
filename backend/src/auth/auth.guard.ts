import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";

import { AuthService } from "./auth.service";
import { AuthRequest } from "./user.types";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & AuthRequest>();
    const token = this.auth.readBearerToken(request.get("authorization"));

    request.user = await this.auth.getUserByToken(token);
    return true;
  }
}
