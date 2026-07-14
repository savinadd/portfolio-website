import { projects } from "../data/projects";

export function ProjectsSection() {
  return (
    <section className="terminal-section">
      <h2>projects</h2>
      {projects.map((item) => (
        <article className="terminal-item" key={item.name}>
          <h3>
            <span aria-hidden="true">./</span>
            {item.href ? (
              <a href={item.href} rel="noreferrer" target="_blank">
                {item.name}
              </a>
            ) : (
              item.name
            )}
          </h3>
          <p>{item.description}</p>
          <p className="muted">{item.stack.join(" · ")}</p>
        </article>
      ))}
    </section>
  );
}
