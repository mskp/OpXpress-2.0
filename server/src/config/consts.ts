import type { CorsOptions } from "cors";

export const PORT = process.env.PORT ?? 3000;

export const ALLOWED_ORIGINS =
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3001";

export const CORS_OPTIONS: CorsOptions = {
  origin: ALLOWED_ORIGINS,
  optionsSuccessStatus: 200,
};
