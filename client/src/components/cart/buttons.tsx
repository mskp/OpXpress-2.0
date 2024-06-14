"use client";

import {
  addToCart,
  clearCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
} from "@/actions/cart";
import { MAX_CART_ITEM_QUANTITY } from "@/config/consts";
import { useCheckoutDialog } from "@/lib/redux/features/checkout-dialog/use-checkout-dialog";
import { useRouter } from "next/navigation";
import { AiOutlineDelete, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

/**
 * IncrementButton component renders a button to increment the quantity of an item in the cart.
 *
 * @param {Object} props - The props object.
 * @param {string} props.productId - The ID of the product.
 * @param {number} props.quantity - The current quantity of the product in the cart.
 * @returns {JSX.Element} The rendered IncrementButton component.
 */
export function IncrementButton({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}): JSX.Element {
  return (
    <Button
      variant={"outline"}
      disabled={quantity === MAX_CART_ITEM_QUANTITY}
      size={"icon"}
      className=" border border-gray-200"
    >
      <AiOutlinePlus onClick={() => increaseQuantity(productId)} size={22} />
    </Button>
  );
}

/**
 * DecrementButton component renders a button to decrement the quantity of an item in the cart.
 *
 * @param {Object} props - The props object.
 * @param {string} props.productId - The ID of the product.
 * @param {number} props.quantity - The current quantity of the product in the cart.
 * @returns {JSX.Element} The rendered DecrementButton component.
 */
export function DecrementButton({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}): JSX.Element {
  return (
    <Button
      size={"icon"}
      variant={quantity === 1 ? "destructive" : "outline"}
      className=" border-gray-200"
    >
      {quantity === 1 ? (
        <AiOutlineDelete onClick={() => deleteFromCart(productId)} size={22} />
      ) : (
        <AiOutlineMinus onClick={() => decreaseQuantity(productId)} size={22} />
      )}
    </Button>
  );
}

/**
 * DeleteFromCartButton component renders a button to delete an item from the cart.
 *
 * @param {Object} props - The props object.
 * @param {string} props.productId - The ID of the product.
 * @returns {JSX.Element} The rendered DeleteFromCartButton component.
 */
export function DeleteFromCartButton({
  productId,
}: {
  productId: string;
}): JSX.Element {
  return (
    <Button
      onClick={() => {
        deleteFromCart(productId);
      }}
      size={"icon"}
      variant={"destructive"}
    >
      <AiOutlineDelete size={20} />
    </Button>
  );
}

/**
 * AddToCartButton component renders a button to add an item to the cart.
 *
 * @param {Object} props - The props object.
 * @param {string} props.productId - The ID of the product.
 * @param {string} [props.className] - The optional className for the button.
 * @param {string} [props.variant] - The optional variant for the button.
 * @returns {JSX.Element} The rendered AddToCartButton component.
 */
export function AddToCartButton({
  productId,
  className,
  variant = "outline",
}: {
  productId: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}): JSX.Element {
  // const { auth } = useAuth();
  // const { setAuthDialog } = useAuthDialog();
  const router = useRouter();

  /**
   * Handles adding the product to the cart.
   */
  async function handleAddToCart() {
    const added = await addToCart(productId);
    if (added) {
      toast({
        title: "Added to cart",
      });
      return router.push(`/cart`);
    } else {
      toast({
        title: "Failed adding to cart",
      });
    }
    return;
  }

  return (
    <Button onClick={handleAddToCart} variant={variant} className={className}>
      Add to bag
    </Button>
  );
}

/**
 * CheckoutButton component renders a button to proceed to checkout.
 *
 * @returns {JSX.Element} The rendered CheckoutButton component.
 */
export function CheckoutButton(): JSX.Element {
  const { setCheckoutDialog } = useCheckoutDialog();

  return (
    <button
      onClick={() => setCheckoutDialog(true)}
      className="rounded-full py-4 px-6 bg-indigo-600 text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-indigo-700 "
    >
      Checkout
    </button>
  );
}

/**
 * ClearCartButton component renders a button to clear the cart.
 *
 * @returns {JSX.Element} The rendered ClearCartButton component.
 */
export function ClearCartButton(): JSX.Element {
  return (
    <Button
      variant={"destructive"}
      onClick={() => {
        clearCart();
      }}
    >
      Clear Cart
    </Button>
  );
}
