"use server";

import axios from "@/config/axios.config";
import { revalidatePath } from "next/cache";

/**
 * Adds a product to the user's cart.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<boolean>} - Returns true if the operation is successful, otherwise false.
 */
export async function addToCart(
  productId: string,
): Promise<{ message: string; success: boolean }> {
  try {
    await axios.post("/cart", { productId });

    revalidatePath(`/cart`);

    return {
      message: "Added to cart",
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) console.log(error.message);

    return {
      message: "Failed adding to cart",
      success: false,
    };
  }
}

/**
 * Increases the quantity of a product in the user's cart by 1.
 * @returns {Promise<boolean>} - Returns true if the operation is successful, otherwise false.
 */
export async function increaseQuantity(productId: string): Promise<boolean> {
  try {
    await axios.patch("/cart", { productId, operation: "INCREASE_QUANTITY" });

    revalidatePath(`/cart`);
    return true;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return false;
  }
}

/**
 * Decreases the quantity of a product in the user's cart by 1.
 * If the quantity becomes 0, the product is removed from the cart.
 * @returns {Promise<boolean>} - Returns true if the operation is successful, otherwise false.
 */
export async function decreaseQuantity(productId: string): Promise<boolean> {
  try {
    await axios.patch("/cart", { productId, operation: "DECREASE_QUANTITY" });

    revalidatePath(`/cart`);
    return true;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return false;
  }
}

/**
 * Removes a product from the user's cart.
 * @returns {Promise<boolean>} - Returns true if the operation is successful, otherwise false.
 */
export async function deleteFromCart(productId: string): Promise<boolean> {
  try {
    await axios.delete("/cart", { data: { productId } });
    revalidatePath(`/cart`);
    return true;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return false;
  }
}

/**
 * Clears all items from the user's cart.
 * @returns {Promise<boolean>} - Returns true if the operation is successful, otherwise false.
 */
export async function clearCart(): Promise<boolean> {
  try {
    await axios.delete("/cart/all");
    revalidatePath(`/cart`);
    return true;
  } catch (error) {
    return false;
  }
}

type CheckoutDetails = {
  fullname: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
};

/**
 * Processes the checkout for the user by creating orders for each item in the cart.
 * @returns {Promise<boolean>} - Returns true if the operation is successful, otherwise false.
 */
export async function checkout(
  checkoutDetails: CheckoutDetails,
): Promise<boolean> {
  try {
    await axios.post("/order", { ...checkoutDetails });
    revalidatePath(`/cart`);
    revalidatePath(`/orders`);
    return true;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return false;
  }
}
