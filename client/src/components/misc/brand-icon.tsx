import { APP_NAME } from "@/config/consts";
import { Andika } from "next/font/google";
import Link from "next/link";

const andika = Andika({ subsets: ["latin"], weight: "700" });

/**
 * The BrandIcon component displays the application's brand name as a link.
 * The link redirects to the home page and can be disabled based on the `isDisabled` prop.
 * When disabled, the link is not clickable.
 */
function BrandIcon({ isDisabled = false }: { isDisabled?: boolean }) {
  return (
    <Link
      href="/"
      className={`${andika.className} ${
        isDisabled ? "pointer-events-none" : ""
      } text-xl hover:opacity-70 text-cyan-600`}
    >
      {APP_NAME}
    </Link>
  );
}

export default BrandIcon;
