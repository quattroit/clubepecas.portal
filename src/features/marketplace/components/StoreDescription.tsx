import { cn } from "@/lib/utils";

type StoreDescriptionProps = {
  description?: string;
  className?: string;
};

/**
 * Descrição pública da loja.
 */
function StoreDescription({ description, className }: StoreDescriptionProps) {
  if (!description) return null;

  return (
    <section
      aria-labelledby="store-description-heading"
      className={cn("flex flex-col gap-2", className)}
    >
      <h2 id="store-description-heading" className="text-h3">
        Sobre a loja
      </h2>
      <p className="text-body text-muted-foreground max-w-3xl">{description}</p>
    </section>
  );
}

export { StoreDescription };
export type { StoreDescriptionProps };
