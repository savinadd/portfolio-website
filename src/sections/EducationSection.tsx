import { education } from "../data/education";

export function EducationSection() {
  return (
    <section className="terminal-section">
      <h2>education</h2>
      <dl>
        <div>
          <dt>school</dt>
          <dd>{education.school}</dd>
        </div>
        <div>
          <dt>program</dt>
          <dd>{education.status}</dd>
        </div>
        <div>
          <dt>details</dt>
          <dd>{education.details.join(" · ")}</dd>
        </div>
      </dl>
    </section>
  );
}
