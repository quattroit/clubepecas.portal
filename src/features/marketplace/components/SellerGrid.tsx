import { SellerCard } from "@/features/marketplace/components/SellerCard";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types/Seller";

type SellerGridProps = {
  sellers: Seller[];
  className?: string;
};

function SellerGrid({ sellers, className }: SellerGridProps) {
  return (
    <ul
      className={cn(
        "grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4",
        className,
      )}
      aria-label="Vendedores"
    >
      {sellers.map((seller) => (
        <li key={seller.slug || `${seller.name}-${seller.city}-${seller.state}`}>
          <SellerCard seller={seller} />
        </li>
      ))}
    </ul>
  );
}

export { SellerGrid };
export type { SellerGridProps };
