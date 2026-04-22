import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { DatabaseService } from "../database/database.service";

type NoteRow = {
  id: number;
  title: string;
  body: string;
  owner_id: number;
  created_at: Date;
};

@Injectable()
export class NotesService {
  constructor(private readonly database: DatabaseService) {}

  async list(ownerId: number) {
    const result = await this.database.query<NoteRow>(
      `
        select id, title, body, owner_id, created_at
        from notes
        where owner_id = $1
        order by created_at desc
      `,
      [ownerId],
    );

    return result.rows;
  }

  async create(ownerId: number, title: string, body: string) {
    const cleanTitle = title.trim();

    if (!cleanTitle || cleanTitle.length > 120 || body.length > 2000) {
      throw new HttpException({ detail: "Bad note title or body" }, HttpStatus.BAD_REQUEST);
    }

    const result = await this.database.query<NoteRow>(
      `
        insert into notes (title, body, owner_id)
        values ($1, $2, $3)
        returning id, title, body, owner_id, created_at
      `,
      [cleanTitle, body, ownerId],
    );

    return result.rows[0];
  }
}
