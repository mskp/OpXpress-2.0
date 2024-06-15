import { Product } from "@/config/types";
import { AddToCartButton } from "../cart/buttons";
import Image from "next/image";
import Link from "next/link";

function ProductCard({ product }: { product: Product }) {
  return (
    <div
      key={product.id}
      className="group relative shadow-sm lg:hover:scale-105 transition-all p-4 rounded-lg bg-neutral-900"
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
            <h3 className="text-sm truncate">{product.name}</h3>
            <p className="mt-1 text-sm capitalize">
              {product.category} &bull; {product.brand}
            </p>
          </div>
          <div>
            {product.price !== product.originalPrice && (
              <p className="text-sm line-through">{product.originalPrice}</p>
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
  );
}
export default ProductCard;
