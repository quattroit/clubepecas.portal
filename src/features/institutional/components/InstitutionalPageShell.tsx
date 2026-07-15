import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type InstitutionalPageShellProps = {
  title: string;
  description?: string;
  breadcrumbLabel: string;
  children: ReactNode;
  className?: string;
};

/**
 * Shell comum das páginas institucionais — leitura confortável + breadcrumb.
 */
function InstitutionalPageShell({
  title,
  description,
  breadcrumbLabel,
  children,
  className,
}: InstitutionalPageShellProps) {
  return (
    <article
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col gap-8 md:gap-10",
        className,
      )}
    >
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.HOME },
          { label: breadcrumbLabel },
        ]}
      />

      <header className="flex flex-col gap-3">
        <h1 className="text-h1">{title}</h1>
        {description ? (
          <p className="text-body text-muted-foreground">{description}</p>
        ) : null}
      </header>

      <div className="flex flex-col gap-8 md:gap-10">{children}</div>
    </article>
  );
}

type InstitutionalSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

function InstitutionalSection({
  id,
  title,
  children,
}: InstitutionalSectionProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-h2 scroll-mt-24">
        {title}
      </h2>
      <div className="text-body text-foreground/90 flex flex-col gap-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

type InstitutionalTocProps = {
  items: { id: string; label: string }[];
};

function InstitutionalToc({ items }: InstitutionalTocProps) {
  return (
    <nav
      aria-label="Nesta página"
      className="border-border bg-surface rounded-xl border p-4 sm:p-5"
    >
      <p className="mb-3 text-sm font-medium">Nesta página</p>
      <ol className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-small text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm outline-none focus-visible:ring-2"
            >
              {index + 1}. {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { InstitutionalPageShell, InstitutionalSection, InstitutionalToc };
