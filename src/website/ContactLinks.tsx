import type { ContactLink } from "../data/contact";

type ContactLinksProps = {
  links: ContactLink[];
};

export function ContactLinks({ links }: ContactLinksProps) {
  return (
    <div className="website-contact-links">
      {links.map((link) => (
        <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
          <span>{link.label}</span>
          {link.value}
        </a>
      ))}
    </div>
  );
}
