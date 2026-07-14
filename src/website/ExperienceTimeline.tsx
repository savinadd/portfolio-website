import type { Job } from "../data/experience";

type ExperienceTimelineProps = {
  jobs: Job[];
};

export function ExperienceTimeline({ jobs }: ExperienceTimelineProps) {
  return (
    <div className="website-timeline">
      {jobs.map((job) => (
        <article key={`${job.company}-${job.role}`}>
          <div className="website-job-heading">
            <p>{job.period}</p>
            <h3>
              {job.role} <span>@ {job.company}</span>
            </h3>
          </div>
          <p className="website-job-summary">{job.summary}</p>
          <ul>
            {job.bullets.slice(0, 2).map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
