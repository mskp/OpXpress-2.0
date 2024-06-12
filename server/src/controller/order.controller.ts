import { z, ZodError } from "zod";
import logger from "../config/logger";
import prisma from "../config/prisma";
import type { ExpressRequest, ExpressResponse } from "../config/types";
import { clearCart } from "../utils";
import { checkoutSchema } from "../utils/validations";

// Define the schema for the user validation
const userSchema = z.object({
  id: z.string(),
});

/**
 * Retrieve all orders for a user.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function GetAllOrders(req: ExpressRequest, res: ExpressResponse) {
  try {
    // Validate and parse the user from the request
    const { id: userId } = userSchema.parse(req.user);

    // Fetch all orders for the user, including order details
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderInfo: true,
        product: true,
      },
    });

    // Return the orders as a JSON response
    res.json(orders);
  } catch (error) {
    // Log any errors and return appropriate status codes
    if (error instanceof Error) logger.error(error.message);
    if (error instanceof ZodError)
      res.status(400).json({ message: error.errors, success: false });
    else res.sendStatus(500);
  }
}

/**
 * Create a new order for the user from the items in their cart.
 * @param {ExpressRequest} req - Express request object.
 * @param {ExpressResponse} res - Express response object.
 */
export async function CreateNewOrder(
  req: ExpressRequest,
  res: ExpressResponse,
) {
  try {
    // Validate and parse the user from the request
    const { id: userId } = userSchema.parse(req.user);

    // Validate and parse the request body
    const { fullname, phone, address, pincode, city } = checkoutSchema.parse(
      req.body,
    );

    // Retrieve cart items for the user from the database
    const cartItems = await prisma.cart.findMany({
      where: {
        userId,
      },
    });

    // Ensure the cart is not empty
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty", success: false });
    }

    // Create orders for each cart item
    for (const cartItem of cartItems) {
      // First, create the OrderInfo record
      const orderInfo = await prisma.orderInfo.create({
        data: {
          fullname,
          phone,
          address,
          pincode,
          city,
        },
      });

      // Then, create the Order record and link it to the OrderInfo
      await prisma.order.create({
        data: {
          userId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          orderInfoId: orderInfo.id,
        },
      });
    }

    // Clear the user's cart after creating the orders
    await clearCart(userId);

    // Send a success status code
    res.sendStatus(200);
  } catch (error) {
    // Log any errors and return appropriate status codes
    if (error instanceof Error) logger.error(error.message);
    if (error instanceof ZodError)
      res.status(400).json({ message: error.errors, success: false });
    else res.sendStatus(500);
  }
}
