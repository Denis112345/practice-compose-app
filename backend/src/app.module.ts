import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { NotesModule } from "./notes/notes.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [DatabaseModule, RedisModule, AuthModule, NotesModule],
  controllers: [AppController],
})
export class AppModule {}
