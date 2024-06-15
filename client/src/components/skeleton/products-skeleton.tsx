import { Skeleton } from "../ui/skeleton";

/**
 * A skeleton loader component for the Products Page.
 *
 * This component displays a skeleton loading state for the products page, which includes placeholders
 * for eight product cards. Each product card has placeholders for an image, title, price, and additional
 * details.
 *
 * @returns {JSX.Element} The skeleton loader for the products page.
 */
function ProductsSkeleton(): JSX.Element {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="group relative shadow-sm p-4 rounded-lg bg-neutral-800"
          >
            <Skeleton className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none lg:h-80 bg-neutral-900"></Skeleton>
            <div className="mt-4 gap-2">
              <Skeleton className="h-6 mb-2 bg-neutral-900" />
              <Skeleton className="h-8 bg-neutral-900" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-6 w-1/3 bg-neutral-900" />
              <Skeleton className="h-10 w-20 rounded-full bg-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ProductsSkeleton;
