import axios from "@/config/axios.config";
import type { Category, Product } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "../cart/buttons";
import ErrorComponent from "./error-component";

type FetchProductsReturnType = {
  success: boolean;
  products: Product[];
};

async function fetchProducts(
  category?: Category,
): Promise<FetchProductsReturnType> {
  const { data } = await axios.get<FetchProductsReturnType>(
    `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`,
  );
  return data;
}

/**
 * The Products component fetches and displays a list of products.
 * It optionally filters products by category.
 *
 * @param {Object} props - The props object.
 * @param {string} [props.category="all"] - The category to filter products by. Defaults to "all".
 * @returns {Promise<JSX.Element>} The rendered Products component.
 */
async function Products({
  category = null,
}: {
  category?: Category;
}): Promise<JSX.Element> {
  let data: FetchProductsReturnType;

  try {
    if (!category) {
      data = await fetchProducts();
    } else {
      data = await fetchProducts(category);
    }
  } catch (error) {
    console.log(error);
    return <ErrorComponent message="Products could not be fetched" />;
  }
  if (!data.success)
    return <ErrorComponent message="Products could not be fetched" />;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
        {data.products.map((product) => (
          <div
            key={product.id}
            className="group relative shadow-sm lg:hover:scale-105 transition-all p-4 rounded-lg"
          >
            <Link href={`/product/${product.id}`}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <Image
                  width={500}
                  height={250}
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-top lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between truncate gap-2">
                <div className="truncate ">
                  <h3 className="text-sm text-gray-700 truncate">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 capitalize">
                    {product.category} &bull; {product.brand}
                  </p>
                </div>
                <div>
                  {product.price !== product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </p>
                  )}
                  <p className="text-lg font-semibold">{product.price}</p>
                </div>
              </div>
            </Link>
            <div className="flex justify-between items-center mt-4">
              <p>{product.discount}</p>
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
