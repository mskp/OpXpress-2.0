import axios from "@/config/axios.config";
import type { Category, Product } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "../cart/buttons";
import ErrorComponent from "../misc/error-component";
import ProductCard from "./product-card";

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
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default Products;
