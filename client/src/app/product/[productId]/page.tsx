import { AddToCartButton } from "@/components/cart/buttons";
import ErrorComponent from "@/components/misc/error-component";
import axios from "@/config/axios.config";
import { Product } from "@/config/types";
import { Metadata } from "next";
import Image from "next/image";

type Props = {
  params: { productId: string };
};

type FetchProductbyIdReturnType = {
  success: boolean;
  product: Product;
};

export async function generateMetadata({
  params: { productId },
}: Props): Promise<Metadata> {
  const data = await fetchProductbyId(productId);
  return {
    title: `OpXpress - ${data.product.name}`,
  };
}

async function fetchProductbyId(
  productId: string,
): Promise<FetchProductbyIdReturnType> {
  const { data } = await axios.get<FetchProductbyIdReturnType>(
    `/products/${productId}`,
  );
  return data;
}

/**
 * Displays detailed information about a specific product.
 *
 * @component
 * @param {object} props - The props object.
 * @param {object} props.params - The parameters object.
 * @param {string} props.params.productId - The ID of the product to display.
 * @returns {JSX.Element} The JSX representation of the ProductPage component.
 */
async function ProductPage({
  params: { productId },
}: {
  params: { productId: string };
}): Promise<JSX.Element> {
  let data: FetchProductbyIdReturnType;

  try {
    data = await fetchProductbyId(productId);
  } catch (error) {
    return <ErrorComponent message="Product could not be fetched" />;
  }

  if (!data.success) return <ErrorComponent message="Product not found" />;

  const { brand, category, discount, imageUrl, name, originalPrice, price } =
    data.product;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              width={500}
              height={500}
              className="max-w-full h-auto object-cover rounded-lg"
              src={imageUrl as string}
              alt="Product Image"
            />
          </div>
          <div className="p-6 w-full lg:w-1/2 lg:p-0">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-200 mb-4">
              {name}
            </h1>
            <span className="block text-gray-400 mb-2 uppercase">
              {brand} &bull; {category} &bull; {discount}
            </span>
            <div className="text-gray-400 mb-4">
              <p className="text-lg">
                <span className="line-through mr-2">{originalPrice}</span>
                {price}
              </p>
            </div>
            <p className="mb-4 lg:text-lg">4.0 ★★★★</p>
            <div className="mb-6">
              <p className="mt-4 md:text-lg lg:text-xl">
                Free Shipping & Returns
              </p>
              <p className="text-sm mt-2 md:text-base lg:text-lg">
                We offer free shipping on all orders with no minimum purchase
                required. If you are not completely satisfied with your
                purchase, you can return it within 30 days for a full refund.
              </p>
              <p className="mt-4 md:text-lg lg:text-xl">Customer Support</p>
              <p className="text-sm mt-2 md:text-base lg:text-lg">
                Our customer support team is available to assist you with any
                questions or concerns. Contact us via email or phone for prompt
                assistance.
              </p>
              <p className="mt-4 md:text-lg lg:text-xl">Product Quality</p>
              <ul className="text-sm mt-2 list-disc list-inside md:text-base lg:text-lg">
                <li>High-quality materials</li>
                <li>Ethically sourced</li>
                <li>Durable and long-lasting</li>
                <li>Easy to care for</li>
              </ul>
              <p className="mt-4 md:text-lg lg:text-xl">
                Satisfaction Guaranteed
              </p>
              <p className="text-sm mt-2 md:text-base lg:text-lg">
                We stand behind the quality of our products. If you are not
                satisfied with your purchase, please contact us for a
                hassle-free return or exchange.
              </p>
            </div>
            <AddToCartButton
              productId={productId}
              variant={"secondary"}
              className="mt-6 w-full py-2 rounded-lg focus:outline-none md:py-3 md:text-lg lg:py-4 lg:text-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
