import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";

import { AuthGuard } from "../auth/auth.guard";
import { AuthRequest } from "../auth/user.types";
import { NotesService } from "./notes.service";

@Controller("notes")
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notes: NotesService) {}

  @Get()
  list(@Req() req: Request & AuthRequest) {
    console.log('GET ALL NOTES')
    return this.notes.list(req.user.id);
  }

  @Post()
  create(
    @Req() req: Request & AuthRequest,
    @Body() body: { title?: string; body?: string },
  ) {
    return this.notes.create(req.user.id, String(body.title || ""), String(body.body || ""));
  }
}
