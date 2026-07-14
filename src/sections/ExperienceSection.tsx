import { jobs } from "../data/experience";

export function ExperienceSection() {
  return (
    <section className="terminal-section">
      <h2>experience</h2>
      {jobs.map((job) => (
        <article className="terminal-item" key={`${job.company}-${job.role}`}>
          <h3>
            <span aria-hidden="true">./</span>
            {job.role} @ {job.company}
          </h3>
          <p className="muted">{job.period}</p>
          <ul>
            {job.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
