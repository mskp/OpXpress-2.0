import bcrypt from "bcryptjs";
import type { Express } from "express";
import request from "supertest";
import prisma from "../config/prisma";

// test credentials
const testEmail = "testuser@example.com";
const testPassword = "testpassword";

/**
 * Creates a mock user in the database for testing purposes.
 *
 * @returns {Promise<string>} The ID of the created user.
 */
export async function createMockUser(): Promise<string> {
  const hashedPassword = await bcrypt.hash(testPassword, 10);
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      password: hashedPassword,
    },
  });

  return user.id;
}

/**
 * Logs in the mock user and retrieves an authentication token.
 *
 * @param {Express} server - The Express server instance.
 * @returns {Promise<string>} The authentication token.
 */
export async function loginUser(server: Express): Promise<string> {
  const res = await request(server)
    .post("/api/auth/login")
    .send({ email: testEmail, password: testPassword });

  return res.body?.token as string;
}

/**
 * Clears the database by deleting all records from the specified tables.
 *
 * @returns {Promise<void>} A promise that resolves when the database is cleared.
 */
export async function clearDatabase(): Promise<void> {
  await prisma.order.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.orderInfo.deleteMany({});
}
