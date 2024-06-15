import ErrorComponent from "@/components/misc/error-component";
import ProductCard from "@/components/product/product-card";
import axios from "@/config/axios.config";
import { Product } from "@/config/types";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  searchParams: { q: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const searchTerm = searchParams.q;

  return {
    title: `Search Results For - ${searchTerm}`,
  };
}

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
}: Props): Promise<JSX.Element> {
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
      <h1 className="text-2xl font-semibold text-gray-200 mt-6 mb-4">
        Search Results
      </h1>
      <p className="text-sm text-gray-300 mb-6">
        {data.products.length} result{data.products.length !== 1 && "s"} found
        for "{q}"
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
        {data.products?.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
