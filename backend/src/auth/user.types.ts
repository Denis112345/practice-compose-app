export type UserRow = {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
};

export type AuthRequest = {
  user: UserRow;
};
