import "dotenv/config";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NextFunction, Request, Response } from "express";

import { AppModule } from "./app.module";
import { requireEnv, requireNumberEnv } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("HTTP");
  const origins = requireEnv("CORS_ORIGINS")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);


  app.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();

    res.on("finish", () => {
      const durationMs = Date.now() - startedAt;
      logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
    });

    next();
  });

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const port = requireNumberEnv("PORT");
  await app.listen(port, "0.0.0.0");
  logger.log(`Backend started on port ${port}`);
}

bootstrap();
