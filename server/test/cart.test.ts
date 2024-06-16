import type { Express } from "express";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/prisma";
import {
  clearDatabase,
  createMockUser,
  loginUser,
} from "../src/utils/test-utils";

describe("Cart Controller", () => {
  let server: Express;
  let mockToken: string;
  let userId: string;

  beforeAll(async () => {
    server = app;

    await clearDatabase();
    userId = await createMockUser();
    mockToken = await loginUser(server);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GetAllCartItems", () => {
    it("should fetch all cart items for a user", async () => {
      await prisma.cart.createMany({
        data: [
          { userId, productId: "6659eb0d62ed8c4498df6830", quantity: 2 },
          { userId, productId: "6659eb0d62ed8c4498df6831", quantity: 1 },
        ],
      });

      const res = await request(server)
        .get("/api/cart")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cartItems).toHaveLength(2);
      expect(res.body.grandTotal).toBeGreaterThan(0);
    });

    it("should handle errors gracefully", async () => {
      const res = await request(server)
        .get("/api/cart")
        .set("Authorization", `Bearer ${mockToken?.substring(0, 10)}`);

      expect(res.status).toBe(401);
    });
  });

  describe("AddToCart", () => {
    it("should add a product to the user's cart", async () => {
      const productId = "6659eb0d62ed8c4498df6830";

      const res = await request(server)
        .post("/api/cart")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ productId });

      expect(res.status).toBe(200);
    });
  });

  describe("DeleteCartItem", () => {
    it("should delete a product from the user's cart", async () => {
      const productId = "6659eb0d62ed8c4498df6830";

      const res = await request(server)
        .delete(`/api/cart`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ productId });

      expect(res.status).toBe(200);
    });

    it("should handle non-existent product in cart", async () => {
      const productId = "6659eb0d62ed8c4498df681a";

      const res = await request(server)
        .delete(`/api/cart`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          productId,
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("ClearCart", () => {
    it("should clear all items from the user's cart", async () => {
      const res = await request(server)
        .delete("/api/cart/all")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
    });

    it("should handle errors gracefully", async () => {
      const res = await request(server)
        .delete("/api/cart/all")
        .set("Authorization", `Bearer ${mockToken?.substring(0, 10)}`);

      expect(res.status).toBe(401);
    });
  });

  describe("UpdateCartItem", () => {
    it("should update the quantity of a product in the user's cart", async () => {
      const productId = "6659eb0d62ed8c4498df6831";

      await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      });

      let res = await request(server)
        .patch(`/api/cart`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ productId, operation: "INCREASE_QUANTITY" });

      expect(res.status).toBe(200);

      res = await request(server)
        .patch(`/api/cart`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ productId, operation: "DECREASE_QUANTITY" });

      expect(res.status).toBe(200);
    });

    it("should handle invalid operations", async () => {
      const productId = "6659eb0d62ed8c4498df6831";

      const res = await request(server)
        .patch(`/api/cart`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ productId, operation: "INVALID_OPERATION" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should handle non-existent product in cart", async () => {
      const productId = "6659eb0d62ed8c4498df681a";

      const res = await request(server)
        .patch(`/api/cart`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ productId, operation: "INCREASE_QUANTITY" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
