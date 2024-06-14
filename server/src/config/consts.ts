import type { CorsOptions } from "cors";

export const PORT = process.env.PORT ?? 3000;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const ACCESS_TOKEN_EXPIRATION =
  process.env.ACCESS_TOKEN_EXPIRATION ?? "10d";

export const ACCESS_TOKEN_KEY_NAME = "opxpress_access_token";

export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

export const CORS_OPTIONS: CorsOptions = {
  origin: ALLOWED_ORIGIN,
  optionsSuccessStatus: 200,
};

export const MAX_CART_ITEM_QUANTITY = 5;
