import { AddToCartButton } from "@/components/cart/buttons";
import ErrorComponent from "@/components/misc/error-component";
import axios from "@/config/axios.config";
import { Product } from "@/config/types";
import Image from "next/image";
import Link from "next/link";

type FetchSearchResultsReturnType = {
  success: boolean;
  products: Product[];
};

async function fetchSearchResults(
  q: string,
): Promise<FetchSearchResultsReturnType> {
  const { data } = await axios.get<FetchSearchResultsReturnType>(
    `/products/search?q=${q}`,
  );
  return data;
}

/**
 * Displays search results based on the provided query.
 *
 * @component
 * @param {object} props - The props object.
 * @param {object} props.searchParams - The search parameters object.
 * @param {string} props.searchParams.q - The search query.
 * @returns {JSX.Element} The JSX representation of the SearchResults component.
 */
export default async function SearchResults({
  searchParams: { q },
}: {
  searchParams: { q: string };
}): Promise<JSX.Element> {
  let data: FetchSearchResultsReturnType;

  try {
    data = await fetchSearchResults(q);
  } catch (error) {
    console.log(error);
    return <ErrorComponent message="Orders could not be fetched" />;
  }

  if (!data.success)
    return <ErrorComponent message="Orders could not be fetched" />;

  if (data.products?.length === 0)
    return <ErrorComponent message="No search results found" />;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
        Search Results
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        {data.products.length} result{data.products.length !== 1 && "s"} found
        for "{q}"
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
        {data.products?.map((product) => (
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
                <div className="truncate">
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
            <div className="flex justify-end mt-4">
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
