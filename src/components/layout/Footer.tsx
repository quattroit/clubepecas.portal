import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from "@/constants/app";
import { FOOTER_NAV_ITEMS } from "@/constants/navigation";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-border mt-auto border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo size="md" />
          <p className="text-small max-w-md">{APP_DESCRIPTION}</p>
        </div>

        <nav aria-label="Institucional" className="md:justify-self-end">
          <p className="mb-3 text-sm font-medium">Institucional</p>
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {FOOTER_NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-small hover:text-foreground focus-visible:ring-ring rounded-md outline-none focus-visible:ring-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-border border-t">
        <div className="text-small mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {APP_NAME}. Todos os direitos reservados.
          </p>
          <p aria-label={`Versão ${APP_VERSION}`}>{APP_VERSION}</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
