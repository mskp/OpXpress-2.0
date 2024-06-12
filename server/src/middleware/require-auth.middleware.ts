import type { NextFunction } from "express";
import { verify as verifyAccessToken } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_KEY_NAME } from "../config/consts"; // Importing constants for JWT verification
import type { ExpressRequest, ExpressResponse } from "../config/types"; // Importing custom type definitions
import type { User } from "../config/express"; // Importing User type definition

/**
 * Middleware to verify JWT token
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export default function RequireAuth(
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) {
  // Retrieve the token from auth header or cookies
  const token =
    req.headers?.authorization?.split(" ")?.[1] ??
    req.cookies?.[ACCESS_TOKEN_KEY_NAME];

  // If token is not present, send a 401 Unauthorized response
  if (!token)
    return res.status(401).json({ message: "Invalid token", success: false });

  try {
    // Verify the token using the secret key
    const decoded = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
    // Attach the decoded user information to the request object
    req.user = decoded as User;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, send a 401 Unauthorized response with an error message
    res.status(401).json({ message: "Invalid token", success: false });
  }
}
