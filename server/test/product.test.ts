import type { Express } from "express";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/prisma";

describe("Products Controller", () => {
  let server: Express;

  beforeAll(async () => {
    server = app;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GetProducts", () => {
    it("should fetch products with valid query parameters", async () => {
      const res = await request(server)
        .get("/api/products")
        .query({ limit: 1, category: "men's clothing" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].name).toBe(
        "Men 511 Lightly Washed Slim Fit Jeans",
      );
    });

    it("should handle invalid query parameters gracefully", async () => {
      const res = await request(server)
        .get("/api/products")
        .query({ limit: "invalid", category: "men's clothing" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GetProductById", () => {
    it("should fetch a product by ID", async () => {
      const productId = "6659eb0d62ed8c4498df682c";
      const res = await request(server).get(`/api/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe("Men Mid-Wash 511 Slim Fit Jeans");
    });

    it("should return 404 for non-existent product ID", async () => {
      const res = await request(server).get(
        "/api/products/6659eb0d62ed8c4498df682a",
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should handle invalid product ID format", async () => {
      const res = await request(server).get("/api/products/invalid_id");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("SearchProducts", () => {
    it("should search products by name", async () => {
      const res = await request(server)
        .get("/api/products/search")
        .query({ q: "watch", limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should handle empty search results", async () => {
      const res = await request(server)
        .get("/api/products/search")
        .query({ q: "nonexistent", limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toHaveLength(0);
    });

    it("should handle search with invalid parameters", async () => {
      const res = await request(server)
        .get("/api/products/search")
        .query({ q: "product", limit: "invalid" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
