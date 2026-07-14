import type { Project } from "../data/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="website-item">
      <h3>
        {project.href ? (
          <a href={project.href} rel="noreferrer" target="_blank">
            {project.name}
          </a>
        ) : (
          project.name
        )}
      </h3>
      <p>{project.description}</p>
      <div className="website-tags" aria-label={`${project.name} technologies`}>
        {project.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}
