import CartComponent from "@/components/cart/cart-component";
import ErrorComponent from "@/components/misc/error-component";
import axios from "@/config/axios.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpXpress | Cart",
};

type FetchCartItemsReturnType = {
  cartItems: any[];
  grandTotal: number;
  success: boolean;
};

async function fetchCartInfo(): Promise<FetchCartItemsReturnType> {
  const { data } = await axios.get<FetchCartItemsReturnType>(`/cart`);
  return data;
}

/**
 * Represents the page where users can view and manage their cart items.
 *
 * @component
 * @param {object} props - The props object.
 * @param {object} props.params - The parameters object.
 * @param {string} props.params.userId - The ID of the user.
 * @returns {JSX.Element} The JSX representation of the CartPage component.
 */
async function CartPage(): Promise<JSX.Element> {
  let data: FetchCartItemsReturnType;

  try {
    data = await fetchCartInfo();
  } catch (error) {
    console.log(error);
    return <ErrorComponent message="Cart items could not be fetched" />;
  }

  if (!data.success)
    return <ErrorComponent message="Cart items could not be fetched" />;

  if (data.cartItems?.length === 0)
    return <ErrorComponent message="Nothing in the cart" />;

  return (
    <section className="py-10 relative">
      <CartComponent cartItems={data.cartItems} grandTotal={data.grandTotal} />
    </section>
  );
}

export default CartPage;
