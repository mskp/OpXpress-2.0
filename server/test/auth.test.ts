import type { Express } from "express";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/prisma";
import { clearDatabase } from "../src/utils/test-utils";

describe("Auth Controller", () => {
  let server: Express;

  beforeAll(() => {
    server = app;
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Signup", () => {
    it("should create a new user and return 201", async () => {
      const res = await request(server)
        .post("/api/auth/signup")
        .send({ email: "testuser@example.com", password: "password" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("testuser@example.com");
    });

    it("should return 409 if user already exists", async () => {
      await prisma.user.create({
        data: {
          email: "testuser1@example.com",
          password: "password",
        },
      });

      const res = await request(server)
        .post("/api/auth/signup")
        .send({ email: "testuser1@example.com", password: "password123" });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for invalid input", async () => {
      const res = await request(server)
        .post("/api/auth/signup")
        .send({ email: "not-an-email", password: "123" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Login", () => {
    it("should login an existing user and return 200", async () => {
      await prisma.user.create({
        data: {
          email: "testuser@example.com",
          password:
            "$2a$10$Zb3DriepYULeiF1kgmKeNuxvJsKfJmDZ/DrIRomPZwEvsk/wPbgre",
        },
      });

      const res = await request(server)
        .post("/api/auth/login")
        .send({ email: "testuser@example.com", password: "password" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for invalid input", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ email: "invalid-email", password: "123" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Logout", () => {
    it("should logout user and return 200", async () => {
      const res = await request(server).delete("/api/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successful");
    });
  });
});
