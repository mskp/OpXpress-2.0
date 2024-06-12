import type { Request } from "express";

type User = {
  id?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
