import { contactLinks } from "../data/contact";
import { education } from "../data/education";
import { jobs } from "../data/experience";
import { projects } from "../data/projects";
import { ContactLinks } from "./ContactLinks";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ListeningCard } from "./ListeningCard";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import "./website.css";

type WebsiteViewProps = {
  onTerminal: () => void;
};

export function WebsiteView({ onTerminal }: WebsiteViewProps) {
  return (
    <main className="website">
      <nav className="website-nav" aria-label="Website navigation">
        <button className="website-terminal-button" type="button" onClick={onTerminal}>
          ./terminal
        </button>
        <div className="website-nav-links">
          <a href="#contact">Contact</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#projects">Projects</a>
        </div>
      </nav>

      <header className="website-hero" id="top">
        <h1>Hi, I'm Savina.</h1>
        <p>
          I build thoughtful software across AI, cloud systems, and useful web
          experiences.
        </p>
        <ListeningCard variant="hero" />
        <div className="website-actions">
          <a href="#contact">Contact</a>
          <a href="#experience">View experience</a>
          <a href="#education">Education</a>
        </div>
      </header>

      <div className="website-grid">
        <section className="website-card website-card-wide" id="contact">
          <SectionHeading title="Contact" />
          <ContactLinks links={contactLinks} />
        </section>

        <section className="website-card website-card-wide" id="experience">
          <SectionHeading title="Experience" />
          <ExperienceTimeline jobs={jobs} />
        </section>

        <section className="website-card website-card-wide website-education-card" id="education">
          <SectionHeading title="Education" />
          <p className="website-school">{education.school}</p>
          <p>{education.status}</p>
          <ul className="website-simple-list">
            {education.details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="website-card website-card-wide" id="projects">
          <SectionHeading title="Projects" />
          <div className="website-list">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
