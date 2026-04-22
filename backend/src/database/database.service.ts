import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool } from "pg";
import type { QueryResultRow } from "pg";

import { requireEnv } from "../config/env";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString: requireEnv("DATABASE_URL"),
  });

  async onModuleInit() {
    await this.initDb();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) {
    return this.pool.query<T>(text, params);
  }

  private async initDb() {
    await this.pool.query(`
      create table if not exists users (
        id serial primary key,
        username varchar(50) unique not null,
        password_hash varchar(255) not null,
        created_at timestamptz not null default now()
      );
    `);

    await this.pool.query(`
      create table if not exists notes (
        id serial primary key,
        title varchar(120) not null,
        body text not null default '',
        owner_id integer not null references users(id) on delete cascade,
        created_at timestamptz not null default now()
      );
    `);
  }
}
