import Products from "@/components/misc/products";
import type { Category } from "@/config/types";

/**
 * Represents the page that displays products based on a specific category.
 *
 * @component
 * @param {object} props - The props object.
 * @param {object} props.params - The parameters object.
 * @param {Category} props.params.categoryName - The category name.
 * @returns {JSX.Element} The JSX representation of the ProductsByCategoryPage component.
 */
function ProductsByCategoryPage({
  params: { categoryName },
}: {
  params: { categoryName: Category };
}): JSX.Element {
  const category = decodeURIComponent(categoryName as string) as Category;
  return <Products category={category} />;
}
export default ProductsByCategoryPage;
