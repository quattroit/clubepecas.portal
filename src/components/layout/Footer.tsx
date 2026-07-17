import Link from "next/link";

import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Logo } from "@/components/layout/Logo";
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from "@/constants/app";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "@/constants/contact";
import { FOOTER_NAV_ITEMS } from "@/constants/navigation";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-brand border-brand-border mt-auto border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo size="md" onBrand />
          <p className="text-small max-w-md leading-relaxed text-brand-muted">
            {APP_DESCRIPTION}
          </p>
        </div>

        <nav aria-label="Institucional">
          <p className="mb-4 text-sm font-semibold text-brand-foreground">
            Institucional
          </p>
          <ul className="flex flex-col gap-2.5">
            {FOOTER_NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-small text-brand-muted hover:text-brand-foreground focus-visible:ring-primary rounded-md transition-colors outline-none focus-visible:ring-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-sm font-semibold text-brand-foreground">
            Contato
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-small text-brand-muted hover:text-brand-foreground transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted hover:text-brand-foreground focus-visible:ring-primary inline-flex w-fit items-center gap-2.5 rounded-md transition-colors outline-none focus-visible:ring-2"
              aria-label={`Instagram @${INSTAGRAM_HANDLE}`}
            >
              <span className="bg-brand-foreground/10 flex size-9 items-center justify-center rounded-full">
                <InstagramIcon className="size-4" />
              </span>
              <span className="text-small">@{INSTAGRAM_HANDLE}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-brand-border border-t">
        <div className="text-small text-brand-muted mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
