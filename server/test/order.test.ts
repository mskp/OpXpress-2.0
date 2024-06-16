import type { Express } from "express";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/prisma";
import {
  clearDatabase,
  createMockUser,
  loginUser,
} from "../src/utils/test-utils";

describe("Order Controller", () => {
  let server: Express;
  let userId: string;
  let mockToken: string;

  beforeAll(async () => {
    server = app;

    await clearDatabase();
    userId = await createMockUser();
    mockToken = await loginUser(server);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GetAllOrders", () => {
    it("should fetch all orders for a user", async () => {
      const orderInfo1 = await prisma.orderInfo.create({
        data: {
          fullname: "John Doe",
          phone: "1234567890",
          address: "123 Main St",
          pincode: "123456",
          city: "Sample City",
        },
      });

      await prisma.order.create({
        data: {
          userId,
          productId: "6659eb0d62ed8c4498df6830",
          quantity: 2,
          orderInfoId: orderInfo1.id,
        },
      });

      const orderInfo2 = await prisma.orderInfo.create({
        data: {
          fullname: "Jane Doe",
          phone: "9876543210",
          address: "456 Elm St",
          pincode: "54321",
          city: "Test City",
        },
      });

      await prisma.order.create({
        data: {
          userId,
          productId: "6659eb0d62ed8c4498df6837",
          quantity: 1,
          orderInfoId: orderInfo2.id,
        },
      });

      const res = await request(server)
        .get("/api/order")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders).toHaveLength(2);
      expect(res.body.orders[0].userId).toBe(userId);
      expect(res.body.orders[0].orderInfo.fullname).toBe("Jane Doe");
    });

    it("should handle errors gracefully", async () => {
      const res = await request(server)
        .get("/api/order")
        .set("Authorization", `Bearer invalidAccessToken`);

      expect(res.status).toBe(401);
    });
  });

  describe("CreateNewOrder", () => {
    it("should create a new order from cart items", async () => {
      await prisma.cart.createMany({
        data: [
          { userId, productId: "6659eb0d62ed8c4498df6837", quantity: 2 },
          { userId, productId: "6659eb0d62ed8c4498df6830", quantity: 1 },
        ],
      });

      const checkoutData = {
        fullname: "John Doe",
        phone: "1234567890",
        address: "123 Main St",
        pincode: "123456",
        city: "Sample City",
      };

      const res = await request(server)
        .post("/api/order")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(checkoutData);

      expect(res.status).toBe(200);

      const cartItems = await prisma.cart.findMany({
        where: {
          userId,
        },
      });
      expect(cartItems).toHaveLength(0);
    });

    it("should handle empty cart gracefully", async () => {
      await prisma.cart.deleteMany({
        where: {
          userId,
        },
      });

      const checkoutData = {
        fullname: "John Doe",
        phone: "1234567890",
        address: "123 Main St",
        pincode: "123456",
        city: "Sample City",
      };

      const res = await request(server)
        .post("/api/order")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(checkoutData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Cart is empty");
    });

    it("should handle errors gracefully", async () => {
      const checkoutData = {
        fullname: "John Doe",
        phone: "1234567890",
        address: "123 Main St",
        pincode: "123456",
        city: "Sample City",
      };

      const res = await request(server)
        .post("/api/order")
        .set("Authorization", `Bearer invalidAccessToken`)
        .send(checkoutData);

      expect(res.status).toBe(401);
    });
  });
});
