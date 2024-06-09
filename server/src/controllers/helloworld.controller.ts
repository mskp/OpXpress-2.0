import type { ExpressRequest, ExpressResponse } from "../config/types";

export function HelloWorldController(
  req: ExpressRequest,
  res: ExpressResponse
) {
  res.send("<h1>Hello world</h1>");
}
