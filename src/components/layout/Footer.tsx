import Link from "next/link";

import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Logo } from "@/components/layout/Logo";
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from "@/constants/app";
import { FOOTER_NAV_ITEMS } from "@/constants/navigation";
import { getPublicPlatformSettings } from "@/lib/platform-settings";

function getInstagramLabel(url: string): string {
  try {
    if (url.startsWith("@")) return url;
    if (!url.includes("://") && !url.startsWith("/")) return `@${url.replace(/^@/, "")}`;
    const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : "Instagram";
  } catch {
    return "Instagram";
  }
}

function toSocialHref(value: string, network: string): string {
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }

  const handle = value.replace(/^@/, "");
  switch (network) {
    case "Instagram":
      return `https://www.instagram.com/${handle}/`;
    case "X":
      return `https://x.com/${handle}`;
    default:
      return value;
  }
}

async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getPublicPlatformSettings();
  const name = settings.platformName ?? APP_NAME;
  const description = settings.platformDescription ?? APP_DESCRIPTION;
  const email = settings.supportEmail;
  const footerCopyright =
    settings.footerCopyright?.replaceAll("{year}", String(year)) ??
    `© ${year} ${name}. Todos os direitos reservados.`;
  const socialLinks = [
    { label: "Instagram", url: settings.instagram },
    { label: "Facebook", url: settings.facebook },
    { label: "YouTube", url: settings.youTube },
    { label: "TikTok", url: settings.tikTok },
    { label: "LinkedIn", url: settings.linkedIn },
    { label: "X", url: settings.x },
  ]
    .filter((social): social is { label: string; url: string } => Boolean(social.url))
    .map((social) => ({
      ...social,
      href: toSocialHref(social.url, social.label),
    }));

  return (
    <footer className="surface-brand border-brand-border mt-auto border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo
            size="md"
            onBrand
            src={settings.logoDarkUrl ?? settings.logoUrl ?? undefined}
            alt={name}
          />
          <p className="text-small max-w-md leading-relaxed text-brand-muted">
            {description}
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
            {email ? (
              <a href={`mailto:${email}`} className="text-small text-brand-muted hover:text-brand-foreground transition-colors">
                {email}
              </a>
            ) : null}
            {socialLinks.map(({ label, url, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-foreground focus-visible:ring-primary inline-flex w-fit items-center gap-2.5 rounded-md transition-colors outline-none focus-visible:ring-2">
                {label === "Instagram" ? (
                  <span className="bg-brand-foreground/10 flex size-9 items-center justify-center rounded-full">
                    <InstagramIcon className="size-4" />
                  </span>
                ) : null}
                <span className="text-small">{label === "Instagram" ? getInstagramLabel(url) : label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-brand-border border-t">
        <div className="text-small text-brand-muted mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {footerCopyright}
          </p>
          <p aria-label={`Versão ${APP_VERSION}`}>{APP_VERSION}</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
