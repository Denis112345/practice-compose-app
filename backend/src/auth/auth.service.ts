import * as crypto from "node:crypto";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

import { DatabaseService } from "../database/database.service";
import { RedisService } from "../redis/redis.service";
import { requireNumberEnv } from "../config/env";
import { UserRow } from "./user.types";

@Injectable()
export class AuthService {
  private readonly sessionTtlSeconds = requireNumberEnv("SESSION_TTL_SECONDS");

  constructor(
    private readonly database: DatabaseService,
    private readonly redis: RedisService,
  ) {}

  async register(username: string, password: string) {
    const cleanUsername = username.trim();

    if (cleanUsername.length < 3 || password.length < 4) {
      throw new HttpException(
        { detail: "Username min 3 chars, password min 4 chars" },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const result = await this.database.query<UserRow>(
        `
          insert into users (username, password_hash)
          values ($1, $2)
          returning id, username, password_hash, created_at
        `,
        [cleanUsername, passwordHash],
      );

      return this.publicUser(result.rows[0]);
    } catch (error: any) {
      if (error.code === "23505") {
        throw new HttpException({ detail: "Username already exists" }, HttpStatus.CONFLICT);
      }

      throw error;
    }
  }

  async login(username: string, password: string) {
    const result = await this.database.query<UserRow>("select * from users where username = $1", [
      username.trim(),
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new HttpException(
        { detail: "Bad username or password" },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    await this.redis.client.setEx(this.sessionKey(token), this.sessionTtlSeconds, String(user.id));

    return { access_token: token, token_type: "bearer" };
  }

  async logout(token: string | null) {
    if (token) {
      await this.redis.client.del(this.sessionKey(token));
    }
  }

  async getUserByToken(token: string | null) {
    if (!token) {
      throw new HttpException({ detail: "Not logged in" }, HttpStatus.UNAUTHORIZED);
    }

    const userId = await this.redis.client.get(this.sessionKey(token));

    if (!userId) {
      throw new HttpException({ detail: "Session expired" }, HttpStatus.UNAUTHORIZED);
    }

    const result = await this.database.query<UserRow>("select * from users where id = $1", [
      userId,
    ]);
    const user = result.rows[0];

    if (!user) {
      throw new HttpException({ detail: "User not found" }, HttpStatus.UNAUTHORIZED);
    }

    await this.redis.client.expire(this.sessionKey(token), this.sessionTtlSeconds);
    return user;
  }

  publicUser(user: UserRow) {
    return {
      id: user.id,
      username: user.username,
      created_at: user.created_at,
    };
  }

  readBearerToken(header?: string) {
    const [scheme, token] = (header || "").split(" ");

    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return null;
    }

    return token;
  }

  private sessionKey(token: string) {
    return `session:${token}`;
  }
}
