import { strict as assert } from "node:assert";
import { test } from "node:test";

import { AppController } from "./app.controller";
import { DatabaseService } from "./database/database.service";
import { RedisService } from "./redis/redis.service";

test("AppController.root returns API status message", () => {
  const controller = new AppController(
    {} as DatabaseService,
    {} as RedisService,
  );

  assert.deepEqual(controller.root(), { message: "NestJS API is alive" });
});

test("AppController.health checks database and redis", async () => {
  const calls: string[] = [];
  const database = {
    async query(sql: string) {
      calls.push(sql);
      return { rows: [] };
    },
  } as unknown as DatabaseService;
  const redis = {
    client: {
      async ping() {
        calls.push("redis ping");
      },
    },
  } as unknown as RedisService;

  const controller = new AppController(database, redis);

  await assert.doesNotReject(() => controller.health());
  assert.deepEqual(calls, ["select 1", "redis ping"]);
});
