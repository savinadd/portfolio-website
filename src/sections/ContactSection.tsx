import { contactLinks } from "../data/contact";

export function ContactSection() {
  return (
    <section className="terminal-section">
      <h2>contact</h2>
      <dl>
        {contactLinks.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>
              <a href={item.href} rel="noreferrer" target="_blank">
                {item.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
