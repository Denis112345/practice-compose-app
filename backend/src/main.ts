import "dotenv/config";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { requireEnv, requireNumberEnv } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = requireEnv("CORS_ORIGINS")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const port = requireNumberEnv("PORT");
  await app.listen(port, "0.0.0.0");
}

bootstrap();
