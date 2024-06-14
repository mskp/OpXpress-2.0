import { ZodError } from "zod";
import logger from "../config/logger";
import prisma from "../config/prisma";
import type { ExpressRequest, ExpressResponse } from "../config/types";
import {
  fetchProductsByProductIdParamSchema,
  fetchProductsQuerySchema,
  searchProductsQuerySchema,
} from "../utils/validations";

/**
 * Retrieve products from the database,
 * optionally filtered by category and limited by a specified number.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function GetProducts(req: ExpressRequest, res: ExpressResponse) {
  try {
    // Validate query parameters using Zod schema
    const { limit, category } = fetchProductsQuerySchema.parse(req.query);

    // Prepare the filter options for Prisma query
    const where = category ? { category } : {};
    const take = limit;

    // Retrieve products from the database with optional filters and limit
    const products = await prisma.product.findMany({
      where,
      take,
    });

    res.json({ products, success: true });
  } catch (error) {
    logger.error(error);

    if (error instanceof ZodError)
      return res.status(400).json({ message: error.errors, success: false });

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
    const { id: productId } = fetchProductsByProductIdParamSchema.parse(
      req.params,
    );

    // Retrieve product by ID from the database
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: `Product not found for Id ${productId}`,
        success: false,
      });
    }

    res.json({ product, success: true });
  } catch (error) {
    logger.error(error);

    if (error instanceof ZodError)
      return res.status(400).json({ message: error.errors, success: false });

    res.sendStatus(500);
  }
}

/**
 * Search products in the database by name or description.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function SearchProducts(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    // Validate query parameters using Zod schema
    const { q, limit, offset } = searchProductsQuerySchema.parse(req.query);

    // Prepare the search options for Prisma query
    const searchQuery = q.toLowerCase();
    const take = limit || 10; // Default limit to 10 if not specified
    const skip = offset || 0; // Default offset to 0 if not specified

    // Retrieve products from the database with search filters
    const products = await prisma.product.findMany({
      where: {
        name: { contains: searchQuery, mode: "insensitive" },
      },
      take,
      skip,
    });

    res.json({ products, success: true });
  } catch (error) {
    logger.error(error);

    if (error instanceof ZodError)
      return res.status(400).json({ message: error.errors, success: false });

    res.sendStatus(500);
  }
}
