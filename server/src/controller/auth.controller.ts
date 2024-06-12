import {
  compare as comparePassword,
  hash as encryptPassword,
  genSalt as generateSalt,
} from "bcryptjs";
import type { CookieOptions } from "express";
import { sign } from "jsonwebtoken";
import { ZodError } from "zod";
import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_KEY_NAME,
  ACCESS_TOKEN_SECRET,
} from "../config/consts";
import logger from "../config/logger";
import prisma from "../config/prisma";
import type { ExpressRequest, ExpressResponse } from "../config/types";
import { authSchema } from "../utils/validations";

const cookieExpirationTime = 10 * 24 * 60 * 60 * 1000; // 10 days

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: cookieExpirationTime,
};

/**
 * Handles user signup
 * @param {ExpressRequest} req - Express request object
 * @param {ExpressResponse} res - Express response object
 */
export async function Signup(req: ExpressRequest, res: ExpressResponse) {
  try {
    // Validate request body
    const { email, password } = authSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    // Generate salt
    const salt = await generateSalt(10);

    // Hash the password
    const hashedPassword = await encryptPassword(password, salt);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        email: true,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    // Log the error and return appropriate status codes
    if (error instanceof Error) logger.error(error.message);

    if (error instanceof ZodError)
      res.status(400).json({ error: error.errors, success: false });

    res.sendStatus(500);
  }
}

/**
 * Handles user login
 * @param {ExpressRequest} req - Express request object
 * @param {ExpressResponse} res - Express response object
 */
export async function Login(req: ExpressRequest, res: ExpressResponse) {
  try {
    // Validate request body
    const { email, password } = authSchema.parse(req.body);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    // Compare the password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    // Generate JWT token
    const token = sign(
      { id: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      },
    );

    // Set the access token in cookie and respond with the proper details
    res
      .cookie(ACCESS_TOKEN_KEY_NAME, token, cookieOptions)
      .json({ message: "Login successful", success: true, token });
  } catch (error) {
    // Log the error and return appropriate status codes
    if (error instanceof Error) logger.error(error.message);
    if (error instanceof ZodError)
      res.status(400).json({ message: error.errors, success: false });

    res.sendStatus(500);
  }
}

/**
 * Handles user logout
 * @param {ExpressRequest} _ - Express request object
 * @param {ExpressResponse} res - Express response object
 */
export async function Logout(_: ExpressRequest, res: ExpressResponse) {
  try {
    // Clear the cookie stored access token
    res
      .clearCookie(ACCESS_TOKEN_KEY_NAME, cookieOptions)
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    // Log the error and return error status code
    if (error instanceof Error) logger.error(error.message);

    res.sendStatus(500);
  }
}
