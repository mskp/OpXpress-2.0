import prisma from "../config/prisma";

/**
 * Function to clear all items from the user's cart.
 * @param {string} userId - The ID of the user.
 */
export async function clearCart(userId: string) {
  await prisma.cart.deleteMany({
    where: {
      userId,
    },
  });
}
