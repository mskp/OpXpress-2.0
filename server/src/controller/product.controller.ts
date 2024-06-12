import { ZodError } from "zod";
import logger from "../config/logger";
import prisma from "../config/prisma";
import type { ExpressRequest, ExpressResponse } from "../config/types";

/**
 * Retrieve all products from the database,
 * with an optional limit on the number of products returned.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function GetAllProducts(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    // Parse the limit query parameter, default to no limit if not provided
    const limit = parseInt(req.query.limit as string, 10) || undefined;

    // Validate limit if provided
    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return res.status(400).send("Invalid limit parameter.");
    }

    // Retrieve products from the database with optional limit
    const products = await prisma.product.findMany({
      take: limit,
    });

    res.json({ products, success: true });
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
    if (error instanceof ZodError)
      res.status(400).json({ message: error.errors, success: false });

    res.sendStatus(500);
  }
}

/**
 * Retrieve products by category from the database.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function GetProductsByCategory(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    const category = req.params.category as string;

    // Validate category parameter
    if (!category) {
      return res.status(400).send("Category parameter is required.");
    }

    // Retrieve products by category from the database
    const products = await prisma.product.findMany({
      where: {
        category,
      },
    });

    if (!products) {
      return res
        .status(404)
        .json({ message: `No products found for category ${category}` });
    }

    res.json({ products, success: true });
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
    if (error instanceof ZodError)
      res.status(400).json({ message: error.errors, success: false });

    res.sendStatus(500);
  }
}

/**
 * Retrieve a product by its ID from the database.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function GetProductById(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    const productId = req.params.id as string;

    // Validate productId parameter
    if (!productId) {
      return res.status(400).send("Product ID parameter is required.");
    }

    // Retrieve product by ID from the database
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: `Product not found for ID ${productId}`,
        success: false,
      });
    }

    res.json(product);
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
    if (error instanceof ZodError)
      res.status(400).json({ message: error.errors, success: false });

    res.sendStatus(500);
  }
}
