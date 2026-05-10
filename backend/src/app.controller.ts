import { Controller, Get } from "@nestjs/common";

import { DatabaseService } from "./database/database.service";
import { RedisService } from "./redis/redis.service";

@Controller()
export class AppController {
  constructor(
    private readonly database: DatabaseService,
    private readonly redis: RedisService,
  ) {}
  @Get()
  root() {
    return { message: "NestJS API is alive" };
  }

  @Get("health")
  async health() {
    await this.database.query("select 1");
    await this.redis.client.ping();

    
    return { api: "ok", postgres: "ok", redis: "ok" };
  }
}
