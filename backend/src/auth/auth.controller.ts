import { Body, Controller, Get, Headers, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";

import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { AuthRequest } from "./user.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  register(@Body() body: { username?: string; password?: string }) {
    return this.auth.register(String(body.username || ""), String(body.password || ""));
  }

  @Post("login")
  login(@Body() body: { username?: string; password?: string }) {
    console.log('test1')
    return this.auth.login(String(body.username || ""), String(body.password || ""));
  }

  @Post("logout")
  @HttpCode(204)
  async logout(@Headers("authorization") authorization?: string) {
    await this.auth.logout(this.auth.readBearerToken(authorization));
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@Req() req: Request & AuthRequest) {
    return this.auth.publicUser(req.user);
  }
}
