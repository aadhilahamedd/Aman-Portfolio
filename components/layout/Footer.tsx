import { site } from "@/data/site";
import { safeSocialLinks } from "@/lib/links";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = safeSocialLinks(site.socials);

  return (
    <footer className="shade-footer border-t border-line">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl text-ink">{site.name}</p>
            <p className="mt-1 text-sm text-muted">{site.role}</p>
          </div>
          <p className="text-sm text-muted">
            © {year} {site.name}
          </p>
        </div>
        {socials.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  className="text-sm text-muted transition-colors hover:text-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </footer>
  );
}
