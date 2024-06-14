import { z, ZodError } from "zod";
import { MAX_CART_ITEM_QUANTITY } from "../config/consts";
import logger from "../config/logger";
import prisma from "../config/prisma";
import type { ExpressRequest, ExpressResponse } from "../config/types";
import { clearCart } from "../utils";

// Define schema for user validation
const userSchema = z.object({
  id: z.string(),
});

// Define schema for adding a product to the cart
const addToCartSchema = z.object({
  productId: z.string(),
});

// Define schema for deleting a product from the cart
const deleteCartItemSchema = z.object({
  productId: z.string(),
});

// Define schema for updating the quantity of a product in the cart
const updateCartItemSchema = z.object({
  productId: z.string(),
  operation: z.enum(["INCREASE_QUANTITY", "DECREASE_QUANTITY"]),
});

/**
 * Get all cart items for a user.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function GetAllCartItems(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    // Validate and parse the user from the request
    const { id: userId } = userSchema.parse(req.user);

    // Fetch all cart items for the user from the database
    const cartItems = await prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    // Calculate the grand total
    const grandTotal = cartItems.reduce((total, { product, quantity }) => {
      const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
      return total + price * quantity;
    }, 0);

    // Return the cart items as a JSON response
    res.json({ cartItems, grandTotal, success: true });
  } catch (error) {
    // Log the error and return appropriate status codes
    logger.error(error);
    if (error instanceof ZodError)
      res.status(400).json({ error: error.errors, success: false });
    else res.sendStatus(500);
  }
}

/**
 * Add a product to the user's cart.
 * If the product already exists in the cart, increment the quantity by 1.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function AddToCart(req: ExpressRequest, res: ExpressResponse) {
  try {
    // Validate and parse the user and request body
    const { id: userId } = userSchema.parse(req.user);
    const { productId } = addToCartSchema.parse(req.body);

    // Check if the product already exists in the user's cart
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      // Increment the quantity by 1 if the product exists
      const newQuantity = existingCartItem.quantity + 1;
      if (newQuantity > MAX_CART_ITEM_QUANTITY) {
        throw new Error(`Quantity cannot exceed ${MAX_CART_ITEM_QUANTITY}`);
      }

      // Update the quantity in the database
      await prisma.cart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      // Create a new cart item if the product does not exist
      await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      });
    }

    res.sendStatus(200);
  } catch (error) {
    // Log the error and return appropriate status codes
    logger.error(error);
    if (error instanceof ZodError)
      res.status(400).json({ error: error.errors, success: false });
    else res.sendStatus(500);
  }
}

/**
 * Delete a product from the user's cart.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function DeleteCartItem(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    // Validate and parse the user and request body
    const { id: userId } = userSchema.parse(req.user);
    const { productId } = deleteCartItemSchema.parse(req.body);

    // Check if the cart item exists
    const cartItem = await prisma.cart.findUnique({
      where: {
        userId,
        productId,
      },
    });

    if (!cartItem)
      return res
        .status(404)
        .json({ message: "Product not found in cart", success: false });

    // Delete the cart item from the database
    await prisma.cart.delete({
      where: {
        userId,
        productId,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    // Log the error and return appropriate status codes
    logger.error(error);
    if (error instanceof ZodError)
      res.status(400).json({ error: error.errors, success: false });
    else res.sendStatus(500);
  }
}

/**
 * Controller to clear all items from the user's cart.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function ClearCartController(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    // Validate and parse the user from the request
    const { id: userId } = userSchema.parse(req.user);

    // Clear the cart
    await clearCart(userId);

    res.sendStatus(200);
  } catch (error) {
    // Log the error and return appropriate status codes
    logger.error(error);
    if (error instanceof ZodError)
      res.status(400).json({ error: error.errors, success: false });
    else res.sendStatus(500);
  }
}

/**
 * Update the quantity of a product in the user's cart.
 * If the new quantity is greater than zero, update the quantity.
 * If the new quantity is zero or less, remove the product from the cart.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function UpdateCartItem(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    // Validate and parse the user and request body
    const { id: userId } = userSchema.parse(req.user);
    const { productId, operation } = updateCartItemSchema.parse(req.body);

    // Check if the product exists in the user's cart
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId,
        productId,
      },
    });

    if (!existingCartItem) {
      return res.status(404).send("Cart item does not exist.");
    }

    // Calculate the new quantity
    let newQuantity;
    switch (operation) {
      case "INCREASE_QUANTITY":
        newQuantity = existingCartItem.quantity + 1;
        if (newQuantity > MAX_CART_ITEM_QUANTITY) {
          return res
            .status(400)
            .send(`Quantity cannot exceed ${MAX_CART_ITEM_QUANTITY}`);
        }
        break;
      case "DECREASE_QUANTITY":
        newQuantity = existingCartItem.quantity - 1;
        break;
      default:
        return res.status(400).json("Invalid operation.");
    }

    if (newQuantity <= 0) {
      // Remove the product from the cart if the new quantity is zero or less
      await prisma.cart.delete({
        where: {
          id: existingCartItem.id,
        },
      });
    } else {
      // Update the quantity in the database
      await prisma.cart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    }

    res.sendStatus(200);
  } catch (error) {
    // Log the error and return appropriate status codes
    logger.error(error);
    if (error instanceof ZodError)
      res.status(400).json({ error: error.errors, success: false });
    else res.sendStatus(500);
  }
}
