import { strict as assert } from "node:assert";
import { test } from "node:test";

import { HttpException, HttpStatus } from "@nestjs/common";

import { DatabaseService } from "../database/database.service";
import { NotesService } from "./notes.service";

test("NotesService.create trims title and inserts note for owner", async () => {
  const createdAt = new Date("2026-05-05T00:00:00.000Z");
  const queries: unknown[][] = [];
  const database = {
    async query(_sql: string, params: unknown[]) {
      queries.push(params);
      return {
        rows: [
          {
            id: 1,
            title: params[0],
            body: params[1],
            owner_id: params[2],
            created_at: createdAt,
          },
        ],
      };
    },
  } as unknown as DatabaseService;
  const service = new NotesService(database);

  const note = await service.create(42, "  First note  ", "hello");

  assert.deepEqual(queries, [["First note", "hello", 42]]);
  assert.deepEqual(note, {
    id: 1,
    title: "First note",
    body: "hello",
    owner_id: 42,
    created_at: createdAt,
  });
});

test("NotesService.create rejects an empty title", async () => {
  const database = {
    async query() {
      throw new Error("query should not be called");
    },
  } as unknown as DatabaseService;
  const service = new NotesService(database);

  await assert.rejects(
    () => service.create(42, "   ", "body"),
    (error: unknown) =>
      error instanceof HttpException &&
      error.getStatus() === HttpStatus.BAD_REQUEST,
  );
});
